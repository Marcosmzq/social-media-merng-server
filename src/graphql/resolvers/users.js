const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const User = require("../../models/User");
const checkAuth = require("../../utils/checkAuth");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Query: {
    async getAllUsers() {
      try {
        const users = await User.find().sort({ createdAt: -1 });
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSingleUser(_, { userId }) {
      try {
        const user = await User.findById(userId);
        if (user) {
          return user;
        } else {
          throw new Error("user not found.");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(_, { username, password }) {
      //Check that the data is valid.
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //Check if the username exists.
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found.";
        throw new UserInputError("User not found.", { errors });
      }
      //Check if the password is correct.
      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        errors.general = "Wrong crendetials.";
        throw new UserInputError("Wrong crendetials.", { errors });
      }
      //Generate token with the user data.
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user.id,
        username: user.username,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      //Check that the data is valid.
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //Check that the email entered does not exist.
      const userEmail = await User.findOne({ email });
      if (userEmail) {
        throw new UserInputError("The email is taken.", {
          errors: {
            email: "The email is taken.",
          },
        });
      }
      //Check that the username entered does not exist.
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("The username is taken.", {
          errors: {
            username: "The username is taken.",
          },
        });
      }
      //Encrypt the password
      password = await bcrypt.hash(password, 12);

      //Save the user dates in a constant.
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      //Save the user in the DB.
      const res = await newUser.save();

      //Generate a token with the user.
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res.id,
        username: res.username,
        token,
      };
    },
    async editUser(_, { desc }, context) {
      const user = checkAuth(context);

      if (desc.trim() === "") {
        throw new Error("Description must not be empty.");
      }
      try {
        console.log(user);
        const userToEdit = await User.findById(user.id);
        if (userToEdit.username === user.username) {
          await userToEdit.updateOne({
            $set: {
              desc,
            },
          });
          const getUserEdited = await User.findById(user.id);
          return getUserEdited;
        } else {
          throw new AuthenticationError("Action not allowed.");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

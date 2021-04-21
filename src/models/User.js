const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  desc: String,
  avatar: String,
  createdAt: String,
});

module.exports = model("User", userSchema);

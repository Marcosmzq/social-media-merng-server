const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server");

const typeDefs = require("./graphql/typeDefs.js");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB is connected!"));

server
  .listen(PORT)
  .then(() => console.log(`Server is listening on port ${PORT}`));

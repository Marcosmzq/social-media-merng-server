const usersResolvers = require("./users");
const postsResolvers = require("./posts");
const commentsResolvers = require("./comments");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    sayHi: () => "Hi world!",
    ...postsResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...postsResolvers.Mutation,
    ...usersResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};

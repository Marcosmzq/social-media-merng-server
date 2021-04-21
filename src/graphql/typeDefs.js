const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    token: String!
    createdAt: String!
    desc: String
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Query {
    getAllPosts: [Post]
    getSinglePost(postId: ID!): Post
    sayHi: String!
    getSingleUser(userId: ID!): User
    getAllUsers: [User]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    updatePost(postId: ID!, newBody: String!): Post!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    editUser(desc: String): User!
  }
`;

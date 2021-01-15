const { gql } = require("apollo-server");
module.exports = gql`
  input Credentials {
    username: String!
    email: String!
    password: String!
  }
  input LoginData {
    email: String!
    password: String!
  }
  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: String!
    updatedAt: String!
  }
  type Mutation {
    register(credentials: Credentials!): User!
    login(credentials: LoginData!): User!
    logout: String
    forgotPassword(email: String!): String
    changePassword(token: String!, newPassword: String!): String
  }
  type Query {
    users: [User!]!
    getUserById(id: ID!): User
    me: User
  }
`;

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
  type AccessToken {
    token: String!
  }
  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: String!
    updatedAt: String!
  }
  type Mutation {
    register(credentials: Credentials!): AccessToken!
    login(credentials: LoginData!): AccessToken!
  }
  type Query {
    users: [User!]!
    getUserById(id: ID!): User!
  }
`;

const { gql } = require("apollo-server");
module.exports = gql`
  input Credentials {
    username: String!
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
    register(credentials: Credentials): User
  }
  type Query {
    users: [User]
  }
`;

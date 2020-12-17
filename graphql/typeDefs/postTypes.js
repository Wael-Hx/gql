const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    user: User!
    title: String!
    type: String
    flairs: [String!]
    images: [String]
    body: String!
    createdAt: String!
    updatedAt: String!
  }

  input PostContent {
    user: ID!
    title: String!
    type: String!
    flairs: [String!]
    images: [String!]
    body: String!
  }

  extend type Query {
    getPostById(id: ID!): Post
    getPosts: [Post!]!
  }

  extend type Mutation {
    createPost(content: PostContent!): Post!
  }
`;

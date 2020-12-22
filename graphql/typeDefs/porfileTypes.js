const { gql } = require("apollo-server");

module.exports = gql`
  input ProfileInput {
    user: ID!
    bio: String
    avatar: String
    posts: ID
    saved: ID
    liked: ID
  }

  type UserProfile {
    id: ID!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Profile {
    user: UserProfile!
    bio: String
    avatar: String
    posts: [Post]
    saved: [Post]
    liked: [Post]
  }

  extend type Query {
    getProfileById(id: ID!): Profile
    myProfile: Profile
  }

  extend type Mutation {
    createProfile(userProfile: ProfileInput!): Profile!
    updateProfile(userProfile: ProfileInput!): Profile!
  }
`;

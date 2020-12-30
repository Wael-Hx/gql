const { gql } = require("apollo-server");

module.exports = gql`
  input ProfileInput {
    displayName: String
    bio: String
    avatar: String
  }

  type UserProfile {
    id: ID!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Profile {
    user: UserProfile!
    displayName: String
    bio: String
    avatar: String
    posts: [Post]
    saved: [Post]
    liked: [Post]
  }

  extend type Query {
    getProfileById(id: ID!): Profile
    myProfile: Profile
    getAllProfiles: [Profile]
  }

  extend type Mutation {
    createProfile(userProfile: ProfileInput!): Profile!
    updateProfile(userProfile: ProfileInput!): Profile!
  }
`;

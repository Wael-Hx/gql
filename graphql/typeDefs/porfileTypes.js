const { gql } = require("apollo-server");

module.exports = gql`
  input Profile {
    id: ID!
    bio: String
    avatar: String
  }

  type Profile {
    user: User!
    bio: String
    avatar: String
    posts: [Post]!
    saved: [Post]!
    liked: [Post]!
  }
`;

const { AuthenticationError } = require("apollo-server");
const Post = require("../../db/models/Post");

module.exports = {
  Query: {
    getPostById: async (_, { id }) => {
      try {
        const post = await Post.findById(id);
        return post;
      } catch (err) {
        console.error(err);
        return err;
      }
    },
    getPosts: async (_, __) => {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        console.error(err);
        return err;
      }
    },
  },
  Mutation: {
    createPost: async (_, { content }, context) => {
      if (!context.userId) {
        return new AuthenticationError("not authorized");
      }
      try {
        const newPost = new Post(content);
        const post = await newPost.save();
        return post;
      } catch (err) {
        console.error(err);
        return err;
      }
    },
  },
};

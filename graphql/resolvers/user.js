const { UserInputError } = require("apollo-server");
const User = require("../../db/models/User");

module.exports = resolvers = {
  Query: {
    users: async (_, __, context) => {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        console.error(err);
        return err.message;
      }
    },
    getUserById: async (_, { id }, context, info) => {
      try {
        const user = await User.findById(id);
        return user;
      } catch (err) {
        console.error(err);
        return err.message;
      }
    },
  },
  Mutation: {
    register: async (_, { credentials: { username, email, password } }) => {
      try {
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
          return new UserInputError("user already exists");
        }
        const newUser = new User({ username, email, password });
        const res = await newUser.save();
        return {
          ...res._doc,
          id: res._id,
        };
      } catch (err) {
        console.error(err);
        return err.message;
      }
    },
    login: async (_, { credentials: { email, password } }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return new UserInputError(
            "user not found , make sure to put the correct credentials"
          );
        } else {
          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            return user;
          } else {
            return new UserInputError(
              "make sure to put the correct credentials"
            );
          }
        }
      } catch (err) {
        console.error(err);
        return err.message;
      }
    },
  },
};

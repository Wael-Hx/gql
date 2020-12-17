const { UserInputError, AuthenticationError } = require("apollo-server");
const User = require("../../db/models/User");
const { generateToken, checkAuth } = require("../../utils/auth");
const { validateInput, validateLogin } = require("../../utils/validateInput");
require("dotenv").config();

module.exports = {
  Query: {
    users: async (_, __, context) => {
      const { authorized } = await checkAuth(context);
      if (!authorized) {
        return new AuthenticationError("not authorized");
      }
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        console.error(err);
        return err.message;
      }
    },
    getUserById: async (_, { id }, context) => {
      if (!context.userId) {
        return new AuthenticationError("not authorized");
      }
      try {
        const user = await User.findById(id);
        return user;
      } catch (err) {
        console.error(err);
        return err.message;
      }
    },
    me: async (_, __, context) => {
      if (!context.userId) {
        return new AuthenticationError("not authorized");
      }
      try {
        const user = await User.findById(context.userId);
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
        const { valid, message } = validateInput({ username, email, password });
        if (!valid) {
          return new UserInputError(message);
        }
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
          return new UserInputError("user already exists");
        }
        const newUser = new User({ username, email, password });
        const res = await newUser.save();
        const token = generateToken(res.id, "3d", process.env.JWT_SECRET);

        return { token };
      } catch (err) {
        console.error(err);
        return err.message;
      }
    },
    login: async (_, { credentials: { email, password } }) => {
      try {
        const { valid, message } = validateLogin({ email, password });
        if (!valid) {
          return new UserInputError(message);
        }
        const user = await User.findOne({ email });
        if (!user) {
          return new UserInputError(
            "user not found , make sure you type the correct credentials"
          );
        } else {
          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            const token = generateToken(user.id, "3d", process.env.JWT_SECRET);
            return { token };
          } else {
            return new UserInputError(
              "make sure you type the correct credentials"
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

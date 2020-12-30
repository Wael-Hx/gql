const { UserInputError } = require("apollo-server");
const Users = require("../../models/users");
const User = require("../../db/models/User");
const { validateInput, validateLogin } = require("../../utils/validateInput");
require("dotenv").config();

module.exports = {
  Query: {
    users: async (_, __, { userId }) => {
      let users = await Users.getAllUsers(userId);
      return users;
    },
    getUserById: async (_, { id }, { userId }) => {
      let user = await Users.getUserById(id, userId);
      return user;
    },
    me: async (_, __, { userId }) => {
      let user = await Users.getUser(userId);
      return user;
    },
  },
  Mutation: {
    register: async (
      _,
      { credentials: { username, email, password } },
      { req }
    ) => {
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
        req.session.userId = res.id;

        return { id: res.id, ...res._doc };
      } catch (err) {
        console.error(err);
        return err;
      }
    },
    login: async (_, { credentials: { email, password } }, { req }) => {
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
            req.session.userId = user.id;

            return user;
          } else {
            return new UserInputError(
              "make sure you type the correct credentials"
            );
          }
        }
      } catch (err) {
        console.error(err);
        return err;
      }
    },
    logout: async (_, __, { req, res }) => {
      return new Promise((resolve) => {
        req.session.destroy((err) => {
          if (err) {
            console.error(err);
            resolve("something wrong happened");
            return;
          }
          res.clearCookie("UAT");
          resolve("ok");
        });
      });
    },
  },
};

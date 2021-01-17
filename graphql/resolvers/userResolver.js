const { UserInputError, ApolloError } = require("apollo-server");
const User = require("../../db/models/User");
const Users = require("../../models/users");
const { generateToken } = require("../../utils/auth");
const {
  validateInput,
  validateLogin,
  validEmail,
} = require("../../utils/validateInput");
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
      const { valid, message } = validateInput({ username, email, password });
      if (!valid) {
        return new UserInputError(message);
      }
      const user = await Users.register({ username, email, password }, req);
      return user;
    },
    login: async (_, { credentials: { email, password } }, { req }) => {
      const { valid, message } = validateLogin({ email, password });
      if (!valid) {
        return new UserInputError(message);
      }
      const user = await Users.login({ email, password }, req);
      return user;
    },
    logout: async (_, __, { req, res }) => {
      return Users.logout(req, res);
    },
    forgotPassword: async (_, { email }) => {
      try {
        if (!validEmail(email)) {
          return new ApolloError("invalid email");
        }
        const user = await User.findOne({ email });
        if (!user) {
          return new ApolloError("invalid email");
        }
        const token = generateToken({ email }, "10m", user.password);
        //console.log(token);
        const message = `<a href="${process.env.ORIGIN}/reset-password/${token}" >click here to reset your password</a>`;
        const status = await Users.sendEmail(
          "You requested a password change",
          message,
          email
        );
        return status;
      } catch (err) {
        console.error(err);
        return err.message;
      }
    },
    changePassword: async (_, { token, newPassword }) => {
      const status = await Users.changePassword(token, newPassword);
      return status;
    },
  },
};

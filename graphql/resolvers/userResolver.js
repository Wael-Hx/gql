const { UserInputError } = require("apollo-server");
const Users = require("../../models/users");
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
  },
};

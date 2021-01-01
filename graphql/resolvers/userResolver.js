const { ApolloError } = require("apollo-server");
const Users = require("../../models/users");
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
    register: async (_, { credentials: { username, email, password } }) => {
      try {
        const token = await Users.register({ username, email, password });
        return { token };
      } catch (err) {
        console.error(err);
        return new ApolloError("you cannot register now , try again later");
      }
    },
    login: async (_, { credentials: { email, password } }) => {
      try {
        token = await Users.login({ email, password });
        return { token };
      } catch (err) {
        console.error(err);
        return new ApolloError("you cannot login now , try again later");
      }
    },
  },
};

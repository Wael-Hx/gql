const {
  UserInputError,
  ApolloError,
  AuthenticationError,
} = require("apollo-server");
const Users = require("../../models/users");
const Token = require("../../db/models/Token");
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
      { res }
    ) => {
      try {
        const { id, token } = await Users.register(
          { username, email, password },
          res
        );
        await new Token({ id, token: token }).save();
        return { token };
      } catch (err) {
        console.error(err);
        return new ApolloError("you cannot register now , try again later");
      }
    },
    login: async (_, { credentials: { email, password } }, { res }) => {
      try {
        const { id, token } = await Users.login({ email, password }, res);
        await new Token({ id, token: token }).save();
        return { token };
      } catch (err) {
        console.error(err);
        return new ApolloError("you cannot login now , try again later");
      }
    },
    logout: async (_, __, { userId, res }) => {
      if (!userId) {
        return new AuthenticationError("not authorized");
      }

      try {
        res.clearCookie("UAT");
        await Token.deleteOne({ id: userId });
        return "logged out successfully";
      } catch (err) {
        console.error(err.message);
      }
    },
  },
};

const User = require("../db/models/User");
const { ApolloError, AuthenticationError } = require("apollo-server");
const { checkAuth } = require("../utils/auth");

const getUser = async (userId) => {
  if (!userId) {
    return null;
  }
  try {
    const user = await User.findById(userId).select("-password");
    return user;
  } catch (err) {
    console.error(err);
    return new ApolloError("user not found");
  }
};

const getUserById = async (id, userId) => {
  const { authorized } = await checkAuth(userId);
  if (!authorized) {
    return new AuthenticationError("not authorized");
  }
  let user = await getUser(id);
  return user;
};

const getAllUsers = async (userId) => {
  const { authorized } = await checkAuth(userId);
  if (!authorized) {
    return new AuthenticationError("not authorized");
  }
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = Users = {
  getUser,
  getUserById,
  getAllUsers,
};

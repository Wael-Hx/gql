const User = require("../db/models/User");
const {
  ApolloError,
  AuthenticationError,
  UserInputError,
} = require("apollo-server");
const { checkAuth } = require("../utils/auth");

const register = async ({ username, email, password }, req) => {
  try {
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
    return err.message;
  }
};

const login = async ({ email, password }, req) => {
  try {
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
        return new UserInputError("make sure you type the correct credentials");
      }
    }
  } catch (err) {
    console.error(err);
    return err.message;
  }
};

const logout = (req, res) => {
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
};

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
  register,
  login,
  logout,
};

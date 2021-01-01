const User = require("../db/models/User");
const {
  ApolloError,
  AuthenticationError,
  UserInputError,
} = require("apollo-server");
const { checkAuth, generateToken } = require("../utils/auth");
const { validateInput, validateLogin } = require("../utils/validateInput");

const register = async ({ username, email, password }, response) => {
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
    const token = generateToken(res.id, "10m", process.env.JWT_SECRET);
    response.cookie(
      "UAT",
      generateToken(res.id, "30d", process.env.JWT_RF_SECRET),
      {
        httpOnly: true,
        sameSite: "lax",
      }
    );
    return { id: res.id, token: token };
  } catch (err) {
    console.error(err.message);
    return err.message;
  }
};

const login = async ({ email, password }, res) => {
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
        const token = generateToken(user.id, "10m", process.env.JWT_SECRET);
        res.cookie(
          "UAT",
          generateToken(user.id, "30d", process.env.JWT_RF_SECRET),
          { httpOnly: true, sameSite: "lax" }
        );
        return { id: user.id, token: token };
      } else {
        return new UserInputError("make sure you type the correct credentials");
      }
    }
  } catch (err) {
    console.error(err.message);
    return err.message;
  }
};

const getUser = async (userId) => {
  if (!userId) {
    return null;
  }
  try {
    const user = await User.findById(userId).select("-password");
    return user;
  } catch (err) {
    console.error(err.message);
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
    console.error(err.message);
    return null;
  }
};

module.exports = Users = {
  getUser,
  getUserById,
  getAllUsers,
  login,
  register,
};
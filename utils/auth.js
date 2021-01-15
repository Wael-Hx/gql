const User = require("../db/models/User");
const { sign } = require("jsonwebtoken");
require("dotenv").config();

const checkAuth = async (userId) => {
  if (!userId) {
    return { authorized: false };
  }
  try {
    const user = await User.findById(userId);
    if (user.roles.includes("admin")) {
      return { authorized: true };
    } else {
      return { authorized: false };
    }
  } catch (err) {
    console.error(err);
    return { authorized: false };
  }
};

const getSession = (session) => {
  const userId = session.userId;

  if (!userId) {
    return null;
  }
  return userId;
};

const generateToken = (payload, period, secret) => {
  const token = sign(payload, secret, {
    expiresIn: period,
  });
  return token;
};

module.exports = { checkAuth, getSession, generateToken };

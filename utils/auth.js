const { sign, verify } = require("jsonwebtoken");
const User = require("../db/models/User");
const Token = require("../db/models/Token");
require("dotenv").config();

const generateToken = (id, period, secret) => {
  return sign({ userId: id }, secret, {
    expiresIn: period,
  });
};

const getUserToken = (headers) => {
  const authHeader = headers["authorization"];
  if (!authHeader) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = verify(token, process.env.JWT_SECRET);
    return payload.userId;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

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

module.exports = { checkAuth, generateToken, getUserToken };

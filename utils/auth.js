const { sign } = require("jsonwebtoken"),
  User = require("../db/models/User"),
  { verify } = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (id, period, secret) => {
  return sign({ userId: id }, secret, {
    expiresIn: period,
  });
};

const checkAuth = async (context) => {
  if (!context.userId) {
    return { authorized: false };
  }
  try {
    const user = await User.findById(context.userId);
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

const getToken = (headers) => {
  const authHeader = headers.cookie;

  if (!authHeader) {
    return null;
  }
  try {
    const token = authHeader.slice(4);
    const payload = verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
};

module.exports = { checkAuth, generateToken, getToken };

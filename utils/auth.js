const { sign } = require("jsonwebtoken");
const User = require("../db/models/User");

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

module.exports = { checkAuth, generateToken };

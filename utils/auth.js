const User = require("../db/models/User");
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

module.exports = { checkAuth, getSession };

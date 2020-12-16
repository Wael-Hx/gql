const { sign } = require("jsonwebtoken");

const generateToken = (id, period, secret) => {
  return sign({ userId: id }, secret, {
    expiresIn: period,
  });
};

module.exports = generateToken;

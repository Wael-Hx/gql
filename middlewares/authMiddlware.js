const { verify } = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return res.sendStatus(401);
  } else {
    try {
      const authToken = cookie.split("=")[1] || "";
      const payload = verify(authToken, process.env.JWT_RF_SECRET);
      req.user = payload.userId;
      next();
    } catch (err) {
      return res.sendStatus(401);
    }
  }
}

module.exports = authMiddleware;

const { ApolloServer } = require("apollo-server-express"),
  app = require("express")(),
  connectDB = require("./db/config");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { getUserToken, generateToken } = require("./utils/auth");
const authMiddleware = require("./middlewares/authMiddlware");
const Token = require("./db/models/Token");
require("dotenv").config();

const PORT = 5000;

(async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({
      userId: getUserToken(req.headers),
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: [process.env.ORIGIN, process.env.ORIGIN2],
      credentials: true,
    },
  });

  app.get("/refresh", authMiddleware, async (req, res) => {
    try {
      const whiteListedToken = await Token.findOne({ id: req.user });
      if (!whiteListedToken) {
        return res.sendStatus(401);
      } else {
        let newToken = generateToken(req.user, "10m", process.env.JWT_SECRET);
        return res.json({ token: newToken });
      }
    } catch (err) {
      console.error(err.message);
      return res.sendStatus(401);
    }
  });

  try {
    await connectDB();

    app.listen(PORT, () => console.log(`http://localhost:${PORT}/graphql  `));
  } catch (err) {
    console.error(err);
  }
})();

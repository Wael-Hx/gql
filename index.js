const { ApolloServer } = require("apollo-server-express"),
  app = require("express")(),
  connectDB = require("./db/config");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { getUserToken } = require("./utils/auth");
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

  try {
    await connectDB();

    app.listen(PORT, () => console.log(`http://localhost:${PORT}/graphql  `));
  } catch (err) {
    console.error(err);
  }
})();

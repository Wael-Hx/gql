const { ApolloServer } = require("apollo-server-express"),
  app = require("express")(),
  session = require("express-session"),
  connectDB = require("./db/config");
MongoDBStore = require("connect-mongodb-session")(session);

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { getSession } = require("./utils/auth");
require("dotenv").config();

const PORT = 5000;

(async function startServer() {
  const store = new MongoDBStore(
    {
      uri: process.env.MONGO_URI,
      collection: "sessions",
    },
    (error) => error && console.error(error)
  );

  app.use(
    session({
      name: "UAT",
      store: store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ userId: getSession(req.session), req, res }),
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  apolloServer.applyMiddleware({ app });

  app.get("/", async (_, res) => res.send("hello"));
  try {
    await connectDB();

    app.listen(PORT, () => console.log(`http://localhost:${PORT}/graphql  `));
  } catch (err) {
    console.error(err);
  }
})();

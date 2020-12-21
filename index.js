const { ApolloServer } = require("apollo-server"),
  typeDefs = require("./graphql/typeDefs"),
  resolvers = require("./graphql/resolvers"),
  connectDB = require("./db/config"),
  { getToken } = require("./utils/auth");

const PORT = 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ payload: getToken(req.headers), req, res }),
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

(async function startServer() {
  try {
    await connectDB();
    const res = await server.listen({ port: PORT });
    console.log(`server running at ${res.url}`);
  } catch (err) {
    console.error(err);
  }
})();

const { ApolloServer } = require("apollo-server"),
  typeDefs = require("./graphql/typeDefs"),
  resolvers = require("./graphql/resolvers"),
  connectDB = require("./db/config"),
  { verify } = require("jsonwebtoken");
require("dotenv").config();

const PORT = 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    if (token) {
      const payload = verify(token, process.env.JWT_SECRET);
      return payload;
    }
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

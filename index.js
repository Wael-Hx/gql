const { ApolloServer } = require("apollo-server"),
  users = require("./graphql/typeDefs/user"),
  resolvers = require("./graphql/resolvers/user"),
  connectDB = require("./db/config");
const PORT = 5000;

const server = new ApolloServer({
  typeDefs: [users],
  resolvers,
});

async function startServer() {
  try {
    await connectDB();
    const res = await server.listen({ port: PORT });
    console.log(`server running at ${res.url}`);
  } catch (err) {
    console.error(err);
  }
}
startServer();

const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const connectDB = require("./db/config");
const PORT = 5000;

const typeDefs = gql`
  type Query {
    hi: String!
  }
`;
const resolvers = {
  Query: {
    hi: () => "hello",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  try {
    await connectDB();
    const res = await server.listen({ port: PORT });
    console.log(`server running at ${res.url}`);
  } catch (err) {}
}
startServer();

const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
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
  const res = await server.listen({ port: PORT });
  console.log(`server running at ${res.url}`);
}

startServer();

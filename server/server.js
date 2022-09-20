const express = require("express");
//import ApolloServer
const { ApolloServer } = require("apollo-server-express");

//import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;
//create a new apollo server and pass in out schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//create a new instance of an apollo server with the graphql schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate out apollo server with the express application as middleware
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      //log where we can go to test out GQL API
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

//call the async function to start the server
startApolloServer(typeDefs, resolvers);

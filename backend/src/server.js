require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const connectDB = require('./db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const auth = require('./middleware/auth');

async function startServer() {
  try {
    console.log('Starting server...');

    const app = express();

    await connectDB(); // 👈 ensure DB connects

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: auth,
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
  }
}

startServer();

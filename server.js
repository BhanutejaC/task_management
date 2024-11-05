// Import necessary libraries
require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema'); // Assuming you have a GraphQL schema defined in 'schema.js'

// Initialize the Express app
const app = express();

// Middleware to handle JSON requests
app.use(express.json());

// MongoDB connection URI from environment variables
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/task_management';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set up GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema, // Your GraphQL schema
  graphiql: true, // Enable GraphiQL interface
}));

// Get PORT from environment variable or set default
const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

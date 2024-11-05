const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

connectDB();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // Enable GraphiQL interface
}));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

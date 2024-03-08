const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");

const mongoose = require("mongoose");
const graphQlSchema=require('./graphql/schema/index')
const graphqlResolver=require('./graphql/resolver')

require('dotenv').config();

const app = express();

app.use(bodyParser.json());



app.use(
  "/graphql",
  graphqlHTTP({
    schema:graphQlSchema,
    rootValue:graphqlResolver,
    graphiql:true
  })
)

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });

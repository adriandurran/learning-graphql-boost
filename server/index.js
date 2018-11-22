const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('dotenv').config({ path: 'variables.env' });

const Recipe = require('./models/Recipe');
const User = require('./models/User');

const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('apollo-server');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const apollo = new ApolloServer({
  schema
});

mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      poolSize: 10,
      useFindAndModify: false,
      useCreateIndex: true
    }
  )
  .then(() => console.log('Database connected'))
  .catch((error) => console.error('Unable to connect to database', error));

const app = express();
app.use(morgan('dev'));

apollo.applyMiddleware({ app });

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(
    `Server listening on PORT ${PORT}, GraphQL ${apollo.graphqlPath}`
  );
});
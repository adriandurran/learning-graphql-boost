const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });

const Recipe = require('./models/Recipe');
const User = require('./models/User');

const { ApolloServer } = require('apollo-server-express');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function() {
  return this.toString();
};

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ Recipe, User, currentUser: req.currentUser })
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
app.use(async (req, res, next) => {
  const token = req.headers['authorization'];
  if (token !== 'null') {
    console.log(token);
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (error) {
      console.error(error);
    }
  }
  next();
});
apollo.applyMiddleware({ app });

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(
    `Server listening on PORT ${PORT}, GraphQL ${apollo.graphqlPath}`
  );
});

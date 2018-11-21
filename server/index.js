const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

require('dotenv').config({ path: 'variables.env' });

const Recipe = require('./models/Recipe');
const User = require('./models/User');

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

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

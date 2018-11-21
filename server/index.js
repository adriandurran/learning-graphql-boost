const express = require('express');

const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

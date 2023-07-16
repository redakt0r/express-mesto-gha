const express = require('express');

const mongoose = require('mongoose');

const helmet = require('helmet');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(DB_URL, {});

app.use(express.json());

app.use(helmet());

app.use((req, _res, next) => {
  req.user = {
    _id: '64b2ffe469bcc21e6e3b3384',
  };

  next();
});

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`App слушает ${PORT}`);
});

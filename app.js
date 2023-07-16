const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

app.use(express.json());

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

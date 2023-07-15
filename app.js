const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

app.use(express.json());
app.use('/users', require('./routes/users'));

app.use((req, _res, next) => {
  req.user = {
    _id: '64b1345ab62062c922f935fc',
  };

  next();
});

app.listen(PORT, () => {
  console.log(`App слушает ${PORT}`);
});

const express = require('express');

const mongoose = require('mongoose');

const helmet = require('helmet');

const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');

const { login, createUser } = require('./controllers/users');

const { NOT_FOUND, PORT, DB_URL } = require('./utils/constants');

const app = express();

mongoose.connect(DB_URL, {});

app.use(express.json());

app.use(helmet());

app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));

app.use('*', (_req, res) => res.status(NOT_FOUND).send({ message: 'Страница не найдена' }));

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
  next();
});

app.listen(PORT, () => {
  console.log(`App слушает ${PORT}`);
});

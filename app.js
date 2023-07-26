const express = require('express');

const mongoose = require('mongoose');

const helmet = require('helmet');

const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');

const auth = require('./middlewares/auth');

const { login, createUser } = require('./controllers/users');

const { PORT, DB_URL } = require('./utils/constants');

const NotFoundError = require('./errors/NotFoundError');

const app = express();

mongoose.connect(DB_URL, {});

app.use(express.json());

app.use(helmet());

app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));

app.use(errors());

app.use('*', () => { throw new NotFoundError('Страница не найдена'); });

app.use((err, _req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App слушает ${PORT}`);
});

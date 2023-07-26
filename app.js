const express = require('express');

const mongoose = require('mongoose');

const helmet = require('helmet');

const cookieParser = require('cookie-parser');

const { errors, celebrate, Joi } = require('celebrate');

const auth = require('./middlewares/auth');

const { login, createUser } = require('./controllers/users');

const {
  PORT, DB_URL, URL_REG_EXP, EMAIL_REG_EXP,
} = require('./utils/constants');

const NotFoundError = require('./errors/NotFoundError');

const app = express();

mongoose.connect(DB_URL, {});

app.use(express.json());

app.use(helmet());

app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(EMAIL_REG_EXP).message('Некорректный email'),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_REG_EXP).message('Некорректная ссылка'),
    email: Joi.string().required().regex(EMAIL_REG_EXP).message('Некорректный email'),
    password: Joi.string().required(),
  }),
}), createUser);

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

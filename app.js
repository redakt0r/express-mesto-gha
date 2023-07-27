const express = require('express');

const mongoose = require('mongoose');

const helmet = require('helmet');

const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');

const rateLimit = require('express-rate-limit');

const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');
const { signInRequestValidation } = require('./middlewares/request-validation');
const { login, createUser } = require('./controllers/users');
const { PORT, DB_URL } = require('./utils/constants');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect(DB_URL, {});

app.use(limiter);

app.use(express.json());

app.use(helmet());

app.use(cookieParser());

app.post('/signin', signInRequestValidation, login);

app.post('/signup', signInRequestValidation, createUser);

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));

app.use(errors());

app.use('*', () => { throw new NotFoundError('Страница не найдена'); });

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App слушает ${PORT}`);
});

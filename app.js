const express = require('express');

const mongoose = require('mongoose');

const helmet = require('helmet');

const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');

const rateLimit = require('express-rate-limit');

const cors = require('cors');

const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');
const { signInRequestValidation } = require('./middlewares/request-validation');
const { login, createUser, signOut } = require('./controllers/users');
const { PORT, DB_URL } = require('./utils/constants');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect(DB_URL, {});

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(limiter);

app.use(express.json());

app.use(helmet());

app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', signInRequestValidation, login);

app.post('/signup', signInRequestValidation, createUser);

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));

app.use('/signout', signOut);

app.use('*', () => { throw new NotFoundError('Страница не найдена'); });

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App слушает ${PORT}`);
});

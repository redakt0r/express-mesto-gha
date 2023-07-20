const bcrypt = require('bcryptjs');
// const cookieParser = require('cookie-parser');
const { generateToken } = require('../utils/token');
const User = require('../models/user');

const {
  BAD_REQUEST,
  NOT_FOUND,
  SOME_ERROR,
  STATUS_OK,
} = require('../utils/constants');

module.exports.getUsers = (_req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка' }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create(
        {
          name, about, avatar, email, password: hash,
        },
      )
        .then((user) => res.status(STATUS_OK).send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(BAD_REQUEST).send({ message: err.message });
            return;
          }
          if (err.code === 11000) {
            res.status(409).send({ message: 'Пользователь с таким Email уже существует' });
            return;
          }
          res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка' });
        });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный ID a?' });
      }
      return res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка', err });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка' }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken({ _id: user._id });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      return res.status(200).send({ _id: user._id });
    })
    .catch((err) => res.status(SOME_ERROR).send({ message: err.message }));
};

module.exports.getCurrentUserInfo = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка' }));
};

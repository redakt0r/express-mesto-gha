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

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
        return;
      }
      res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка' });
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
        return res.status(BAD_REQUEST).send({ message: 'Некорректный ID' });
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

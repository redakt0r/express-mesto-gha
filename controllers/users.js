const bcrypt = require('bcryptjs');

const { generateToken } = require('../utils/token');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');

const NotFoundError = require('../errors/NotFoundError');

const ConflictError = require('../errors/ConflictError');

const { STATUS_OK } = require('../utils/constants');

module.exports.getUsers = (_req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
        .then(() => res.status(STATUS_OK).send({
          email, name, about, avatar,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') { throw new BadRequestError(err.message); }
          if (err.code === 11000) { throw new ConflictError('Пользователь с таким Email уже существует'); }
          next(err);
        })
        .catch(next);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь не найден'); }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') { throw new BadRequestError(err.message); }
      next(err);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new BadRequestError(err.message); }
      next(err);
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new BadRequestError(err.message); }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken({ _id: user._id });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      return res.send({
        user: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch(next);
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.signOut = (_req, res, next) => {
  if (res.cookie) {
    res.clearCookie('jwt').send({ message: 'Вы вышли из приложения' }).catch(next);
  }
};

const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const AuthorizationError = require('../errors/AuthorizationError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      minLength: [2, 'Минимальная длина поля "name" - 2, вы ввели `{VALUE}`'],
      maxLength: [30, 'Максимальная длина поля "name" - 30, вы ввели `{VALUE}`'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      required: false,
      minLength: [2, 'Минимальная длина поля "about" - 2, вы ввели `{VALUE}`'],
      maxLength: [30, 'Максимальная длина поля "about" - 30, вы ввели `{VALUE}`'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      required: false,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный Email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) { throw new AuthorizationError('Неправильные почта или пароль'); }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { throw new AuthorizationError('Неправильные почта или пароль'); }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

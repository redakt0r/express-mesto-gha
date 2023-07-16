const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minLength: [2, 'Минимальная длина поля "name" - 2, вы ввели `{VALUE}`'],
      maxLength: [30, 'Максимальная длина поля "name" - 30, вы ввели `{VALUE}`'],
    },
    about: {
      type: String,
      required: [true, 'Поле "about" должно быть заполнено'],
      minLength: [2, 'Минимальная длина поля "about" - 2, вы ввели `{VALUE}`'],
      maxLength: [30, 'Максимальная длина поля "about" - 30, вы ввели `{VALUE}`'],
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);

const { celebrate, Joi } = require('celebrate');
const { URL_REG_EXP, EMAIL_REG_EXP } = require('../utils/constants');

module.exports.signInRequestValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(EMAIL_REG_EXP).message('Некорректный email'),
    password: Joi.string().required(),
  }),
});

module.exports.signInRequestValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_REG_EXP).message('Некорректная ссылка'),
    email: Joi.string().required().regex(EMAIL_REG_EXP).message('Некорректный email'),
    password: Joi.string().required().min(4),
  }),
});

module.exports.postCardRequestValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(URL_REG_EXP).message('Некорректная ссылка'),
  }),
});

module.exports.deleteCardRequestValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required().hex(),
  }),
});

module.exports.handleLikeRequestValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required().hex(),
  }),
});

module.exports.getUserByIdRequestValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required().hex(),
  }),
});

module.exports.updateUserInfoRequestValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.updateAvatarRequestValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(URL_REG_EXP).message('Некорректная ссылка'),
  }),
});

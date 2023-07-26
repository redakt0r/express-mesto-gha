const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_REG_EXP } = require('../utils/constants');

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

router.get('/me', getCurrentUserInfo);
router.get('/:userId', getUserById);
router.get('/', getUsers);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(URL_REG_EXP).message('Некорректная ссылка.'),
  }),
}), updateUserAvatar);

module.exports = router;

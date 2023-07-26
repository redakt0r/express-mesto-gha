const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { URL_REG_EXP } = require('../utils/constants');

const {
  getCards,
  postCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(URL_REG_EXP).message('Некорректная ссылка'),
  }),
}), postCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;

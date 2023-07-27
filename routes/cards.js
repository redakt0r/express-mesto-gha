const router = require('express').Router();

const { postCardRequestValidation, deleteCardRequestValidation, handleLikeRequestValidation } = require('../middlewares/request-validation');

const {
  getCards,
  postCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', postCardRequestValidation, postCard);
router.delete('/:cardId', deleteCardRequestValidation, deleteCardById);
router.put('/:cardId/likes', handleLikeRequestValidation, likeCard);
router.delete('/:cardId/likes', handleLikeRequestValidation, dislikeCard);

module.exports = router;

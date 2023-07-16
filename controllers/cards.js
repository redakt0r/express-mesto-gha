const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SOME_ERROR,
  STATUS_OK,
} = require('../utils/constants');

module.exports.getCards = (_req, res) => {
  Card.find({})
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка' }));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
        return;
      }
      res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка' });
    });
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный ID' });
      }
      return res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка', err });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .populate('likes')
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный ID' });
      }
      return res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка', err });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .populate('likes')
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный ID' });
      }
      return res.status(SOME_ERROR).send({ message: 'Произошла неопознанная ошибка', err });
    });
};

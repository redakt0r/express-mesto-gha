const Card = require('../models/card');

module.exports.getCards = (_req, res) => {
  Card.find({})
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла неопознанная ошибка' }));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Произошла неопознанная ошибка' });
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
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Некорректный ID' });
      }
      return res.status(500).send({ message: 'Произошла неопознанная ошибка', err });
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
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Некорректный ID' });
      }
      return res.status(500).send({ message: 'Произошла неопознанная ошибка', err });
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
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Некорректный ID' });
      }
      return res.status(500).send({ message: 'Произошла неопознанная ошибка', err });
    });
};

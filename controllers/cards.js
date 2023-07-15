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
        res.status(400).send({ message: 'Введены некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Произошла неопознанная ошибка' });
    });
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params.cardId;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Произошла неопознанная ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Произошла неопознанная ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Произошла неопознанная ошибка' }));
};

const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла какая-то ошибка' }));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла какая-то ошибка' }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findOneAndDelete()
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла какая-то ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла какая-то ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла какая-то ошибка' }));
};

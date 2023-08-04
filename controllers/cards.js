const Card = require('../models/card');
const { STATUS_OK } = require('../utils/constants');

const BadRequestError = require('../errors/BadRequestError');

const ForbiddenError = require('../errors/ForbiddenError');

const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .populate('likes')
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new BadRequestError(err.message); }
      next(err);
    })
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => { throw new NotFoundError('Карточка не найдена'); })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) { throw new ForbiddenError('Чужую карточку нельзя удалить'); }
      Card.deleteOne(card)
        .then((data) => {
          res.send({ data });
        });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') { throw new BadRequestError('Некорректный ID'); }
      next(err);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка не найдена'); })
    .populate('likes')
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') { throw new BadRequestError('Некорректный ID'); }
      next(err);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка не найдена'); })
    .populate('likes')
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') { throw new BadRequestError('Некорректный ID'); }
      next(err);
    })
    .catch(next);
};

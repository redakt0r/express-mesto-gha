const User = require('../models/user');

module.exports.getUsers = (_req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла какая-то ошибка' }));
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла какая-то ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла какая-то ошибка' }));
};

module.exports.updateUserInfo = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла какая-то ошибка' }));
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла какая-то ошибка' }));
};

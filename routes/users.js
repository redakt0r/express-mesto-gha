const router = require('express').Router();
const User = require('user', './models/user');

router.post('/', (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: 'Произошла какая-то ошибка' })
    );
});

const router = require('express').Router();

const { getUsers, getUserById, postUser } = require('../controllers/users');

router.post('/', postUser);

router.get('/:userId', getUserById);

router.get('/', getUsers);

module.exports = router;

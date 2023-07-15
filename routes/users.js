const router = require('express').Router();

const {
  getUsers,
  getUserById,
  postUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.post('/', postUser);
router.get('/:userId', getUserById);
router.get('/', getUsers);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;

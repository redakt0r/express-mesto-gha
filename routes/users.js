const router = require('express').Router();
const { getUserByIdRequestValidation, updateUserInfoRequestValidation, updateAvatarRequestValidation } = require('../middlewares/request-validation');

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

router.get('/me', getCurrentUserInfo);
router.get('/:userId', getUserByIdRequestValidation, getUserById);
router.get('/', getUsers);
router.patch('/me', updateUserInfoRequestValidation, updateUserInfo);
router.patch('/me/avatar', updateAvatarRequestValidation, updateUserAvatar);

module.exports = router;

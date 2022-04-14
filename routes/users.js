const router = require('express').Router();
const {
  updateProfileUserValidator,
  updateAvatarUserValidator,
  userIdValidator,
} = require('../validators/celebrate-validators');

const {
  getUsers,
  getUser,
  getAuthUser,
  updateProfileUser,
  updateAvatarUser,
  logout,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getAuthUser);
router.get('/users/:userId', userIdValidator, getUser);
router.patch('/users/me', updateProfileUserValidator, updateProfileUser);
router.patch('/users/me/avatar', updateAvatarUserValidator, updateAvatarUser);
router.delete('/logout', logout);

module.exports = router;

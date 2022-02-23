const router = require('express').Router();
const multer = require('multer');
const userController = require('./userController');
const { getMe } = require('./userMiddleware');
const { protect, restrictTo } = require('../auth').middleware;

const upload = multer({ dest: 'backend/public/img/users' });

router.route('/').get(protect, restrictTo('admin'), userController.getAllUsers);

router
  .route('/me')
  .get(protect, getMe, userController.getUser)
  .patch(protect, getMe, upload.single('photo'), userController.updateUser)
  .delete(protect, getMe, userController.deleteUser);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;

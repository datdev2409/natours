const router = require('express').Router();
const userController = require('./userController');
const { protect, restrictTo } = require('../auth').middleware;

router.route('/').get(protect, restrictTo('admin'), userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

router.use(protect);
router.use(userController.getMe);
router
  .route('/me')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

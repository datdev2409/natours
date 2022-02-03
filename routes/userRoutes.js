const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.route('/').get(authController.protect, userController.getAllUsers);
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/admin/signup', authController.adminSignup);

router
	.route('/:id')
	.get(userController.getUser)
	.delete(userController.deleteUser)
	.patch(userController.updateUser);

module.exports = router;

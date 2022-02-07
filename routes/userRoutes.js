const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.route('/').get(userController.getAllUsers);
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

// Sent email to user, with reset token
router.post('/forgotPassword', authController.forgotPasword);
router.post('/resetPassword/:token', authController.resetPassword);

router
	.use(authController.protect)
	.post('/changePassword', userController.updatePassword)
	.post('/updateme', userController.updateMe)
	.delete('/deleteme', userController.deleteMe);

router
	.route('/:id')
	.get(userController.getUser)
	.delete(userController.deleteUser)
	.patch(userController.updateUser);

module.exports = router;

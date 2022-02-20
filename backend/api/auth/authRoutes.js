const router = require('express').Router();
const authController = require('./authController');
const { validate } = require('./authMiddleware');

router.post('/register', validate('register'), authController.register);
router.post('/login', validate('login'), authController.login);
// router.post('/password_forgot', authController.forgotPassword);
// router.post('/password_reset/:token', authController.resetPassword);

module.exports = router;

const router = require('express').Router();
const authController = require('./authController');
const { validate, protect } = require('./authMiddleware');

router.post('/register', validate('register'), authController.register);
router.post('/login', validate('login'), authController.login);
router.get('/logout', authController.logout);

router
  .route('/password-update')
  .post(protect, validate('passwordChange'), authController.updatePassword);
// router.post('/password_forgot', authController.forgotPassword);
// router.post('/password_reset/:token', authController.resetPassword);

module.exports = router;

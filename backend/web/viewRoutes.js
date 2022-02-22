const router = require('express').Router();
const viewController = require('./viewController');
const { isLoggedIn, protect } = require('../api/auth/authMiddleware');

router.get('/', isLoggedIn, viewController.getOverview);
router.get('/login', viewController.getLoginPage);
// router.get('/logout', viewController.logOut);
router.get('/register', viewController.getRegisterPage);
router.get('/me', protect, viewController.getMePage);
router.get('/tours/:slug', protect, viewController.getTourDetail);

module.exports = router;

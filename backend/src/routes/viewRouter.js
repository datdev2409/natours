const router = require('express').Router()
const { authenticate, isLoggedIn } = require('../controllers/authController')
const viewController = require('../controllers/viewController')

// Routes
router.get('/', isLoggedIn, viewController.getOverview)
router.get('/tours/:slug', viewController.getTour)

router.get('/login', viewController.getLoginForm)
router.get('/logout', viewController.logoutUser)


module.exports = router
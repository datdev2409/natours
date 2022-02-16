const router = require('express').Router()
const authController = require('../controllers/authController')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/password_forgot', authController.forgotPassword)
router.post('/password_reset/:token', authController.resetPassword)

module.exports = router

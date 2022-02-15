const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { authenticate, authorize } = require('../controllers/authController')
const reviewRouter = require('./reviewRoutes')

router.use('/:userId/reviews', reviewRouter)
router.use(authenticate)
router.get('/', authorize('admin'), userController.getAllUsers)

router
	.route('/me')
	.get(userController.getMe, userController.getUser)
	.patch(userController.getMe, userController.updateUser)
	.delete(userController.getMe, userController.deleteUser)

router
	.route('/:id')
	.get(userController.getUser)
	.delete(userController.deleteUser)
	.patch(userController.updateUser)

module.exports = router

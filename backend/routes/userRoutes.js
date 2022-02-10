const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { authenticate, authorize } = require('../controllers/authController')
const reviewRouter = require('./reviewRoutes')

router.use('/:userId/reviews', reviewRouter)
router.use(authenticate)
router.get('/', authorize('admin'), userController.getAllUsers)
router
	.route('/:id')
	.get(userController.getUser)
	.delete(userController.deleteUser)
	.patch(userController.updateUser)

router.use(userController.getMe)
router
	.route('/me')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser)

module.exports = router

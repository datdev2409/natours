const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { authenticate, authorize } = require('../controllers/authController')

router
	.route('/')
	.get(authenticate, authorize('admin'), userController.getAllUsers)

router
	.use(authenticate)
	.post('/updatepassword', userController.updatePassword)
	.post('/updateme', userController.updateMe)
	.delete('/deleteme', userController.deleteMe)

router
	.route('/:id', authenticate)
	.get(userController.getUser)
	.delete(userController.deleteUser)
	.patch(userController.updateUser)

module.exports = router

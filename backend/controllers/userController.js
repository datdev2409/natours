const User = require('../models/userModel')
const factory = require('../controllers/factoryController')

class UserController {
	getUser = factory.getOne(User)
	getAllUsers = factory.getAll(User)
	updateUser = factory.updateOne(User)
	deleteUser = factory.deleteOne(User)
}

module.exports = new UserController()

// const updateMe = asyncHandler(async (req, res) => {
// 	if (req.body.password || req.body.confirmPassword) {
// 		throw new AppError('This route is not used for password update', 400)
// 	}

// 	const filteredObj = filterObj(req.body, ['name', 'email'])
// 	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
// 		new: true,
// 		runValidators: true
// 	})
// 	res.status(200).json({ status: 'success', user: updatedUser })
// })

// // @desc		Update password current user
// // @route		PATCH /user/updatepasssword
// // @access	Private
// const updatePassword = asyncHandler(async (req, res) => {
// 	const user = await User.findById(req.user._id)
// 	const { currentPassword, newPassword, passwordConfirm } = req.body
// 	// Check old password
// 	if (!currentPassword)
// 		return next(new AppError('Please provide password', 403))

// 	const match = await user.verifyPassword(currentPassword, user.password)
// 	if (!match) {
// 		return next(new AppError("Password doesn't not match", 403))
// 	}

// 	user.password = newPassword
// 	user.passwordConfirm = passwordConfirm
// 	await user.save()

// 	res.status(200).json({
// 		status: 'success',
// 		message: 'Change password successfully'
// 	})
// })

// // @desc		Delete current user
// // @route		DELETE /user/deleteme
// // @access	Private
// const deleteMe = asyncHandler(async (req, res) => {
// 	await User.findByIdAndUpdate(req.user.id, { active: false })
// 	res.status(204).json({ status: 'success', data: null })
// })

// module.exports = {
// 	updatePassword,
// 	updateMe,
// 	deleteMe
// }

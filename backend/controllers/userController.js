const User = require('../models/userModel')
const AppError = require('../utils/appError')
const filterObj = require('../utils/filterObj')
const asyncHandler = require('express-async-handler')

// @desc		Get all users
// @route		GET /users/
// @access	Private (admin)
const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find({})
	res.status(200).json({ status: 'success', user: users })
})

// @desc		Get user
// @route		GET /user/:id
// @access	Private (admin)
const getUser = asyncHandler(async (req, res) => {
	const id = req.params.id
	const user = await User.findById(id)
	res.status(200).json({ status: 'success', user: user })
})

// @desc		Delete user
// @route		DELETE /user/:id
// @access	Private
const deleteUser = asyncHandler(async (req, res) => {
	const id = req.params.id
	await User.findByIdAndDelete(id)
	res.status(204).json({ status: 'success' })
})

// @desc		Update user
// @route		PATCH /user/:id
// @access	Private
const updateUser = asyncHandler(async (req, res) => {
	const id = req.params.id
	const data = req.body
	const user = await User.findByIdAndUpdate(id, data)
	res.status(200).json({ status: 'success', user: user })
})

// @desc		Update current user logged in
// @route		PATCH /user/updateMe
// @access	Private
const updateMe = asyncHandler(async (req, res) => {
	if (req.body.password || req.body.confirmPassword) {
		throw new AppError('This route is not used for password update', 400)
	}

	const filteredObj = filterObj(req.body, ['name', 'email'])
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
		new: true,
		runValidators: true
	})
	res.status(200).json({ status: 'success', user: updatedUser })
})

// @desc		Update password current user
// @route		PATCH /user/updatepasssword
// @access	Private
const updatePassword = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
	const { currentPassword, newPassword, passwordConfirm } = req.body
	// Check old password
	if (!currentPassword)
		return next(new AppError('Please provide password', 403))

	const match = await user.verifyPassword(currentPassword, user.password)
	if (!match) {
		return next(new AppError("Password doesn't not match", 403))
	}

	user.password = newPassword
	user.passwordConfirm = passwordConfirm
	await user.save()

	res.status(200).json({
		status: 'success',
		message: 'Change password successfully'
	})
})

// @desc		Delete current user
// @route		DELETE /user/deleteme
// @access	Private
const deleteMe = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(req.user.id, { active: false })
	res.status(204).json({ status: 'success', data: null })
})

module.exports = {
	getAllUsers,
	getUser,
	deleteUser,
	updateUser,
	updatePassword,
	updateMe,
	deleteMe
}

const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const { promisify } = require('util')
const sendEmail = require('../utils/email')
const sendUserToken = require('../utils/sendUserToken')
const filterObj = require('../utils/filterObj')
const asyncHandler = require('express-async-handler')

// @desc		Login
// @route		POST /auth/login
// @access	Public
const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body
	if (!email || !password)
		throw new AppError('Please enter email or password', 404)

	// password (select: false) can not be access by default
	const user = await User.findOne({ email }).select('+password +loginAttempts')
	if (!user) throw new AppError('No user in DB', 404)
	if (user.lockUntil && Date.now() < user.lockUntil) {
		throw new AppError('Your account is locked', 403)
	}

	const match = await user.verifyPassword(password, user.password)
	if (!match) {
		user.wrongPassword()
		throw new AppError(`${user.loginAttempts - 1}`, 403)
	}

	user.rightPassword()
	sendUserToken(user, res)
})

// @desc		Register
// @route		POST /auth/register
// @access	Public
const register = asyncHandler(async (req, res) => {
	const data = filterObj(req.body, [
		'name',
		'email',
		'password',
		'passwordConfirm'
	])
	const newUser = await User.create(data)
	sendUserToken(newUser, res, 200)
})

// @desc		Authenticate
// @route		Middleware
// @access	Public
const authenticate = asyncHandler(async (req, res, next) => {
	const token = req.cookies.jwt
	if (!token) throw new AppError('Please login', 401)

	// 2) Verify JWT
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

	// 3) Check user exit
	const user = await User.findById(decoded.id)
	if (!user) throw new AppError('Token belongs to user no longer exists')

	// 4) Check password changed or not
	const isPasswordChangeAfter = user.isPasswordChangeAfter(decoded.iat)
	if (isPasswordChangeAfter)
		throw new Error('Password is changed, login again', 401)

	req.user = user
	next()
})

// @desc		Authorize
// @route		Middleware
// @access	Public
const authorize = function (...roles) {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			next(new AppError('Dont have permission', 401))
		next()
	}
}

// @desc		Forgot password
// @route		PATCH /auth/password_forgot
// @access	Public
const forgotPassword = asyncHandler(async (req, res) => {
	// 1) Get user by email
	const user = await User.findOne({ email: req.body.email })
	if (!user) next(new AppError('No user with that email address', 404))

	// 2) Generate reset token
	user.createRandomResetToken()
	await user.save({ validateBeforeSave: false })
	console.log(__dirname)
	// 3) Send it back to user's email
	const options = {
		to: user.email,
		subject: 'Email reset password (validate in 10mins)',
		text: `Click the link below to reset password\n ${req.protocol}://${req.get(
			'host'
		)}${req.baseUrl}/resetPassword/${user.passwordResetToken}`
	}

	try {
		await sendEmail(options)
		res.status(200).json({
			status: 'success',
			data: 'Email sent'
		})
	} catch (error) {
		user.passwordResetToken = undefined
		user.passwordResetExpires = undefined
		return next(error)
	}
})

// @desc		Reset password
// @route		POST /auth/password_reset/:token
// @access	Private
const resetPassword = asyncHandler(async (req, res) => {
	const token = req.params.token

	// Get user
	const user = await User.findOne({ passwordResetToken: token })
	if (!user)
		return next(new Error('Can not find user with that reset token', 404))

	if (Date.now() > user.passwordResetExpires)
		return next(new Error('Reset token is expired'), 404)

	user.password = req.body.newPassword
	user.passwordConfirm = req.body.passwordConfirm
	user.passwordResetToken = undefined
	user.passwordResetExpires = undefined
	await user.save()

	sendUserToken(user, res)
})

module.exports = {
	register,
	login,
	authenticate,
	authorize,
	resetPassword,
	forgotPassword
}

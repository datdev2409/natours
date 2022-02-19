const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')
const asyncHandler = require('express-async-handler')

const generateToken = (data = {}) => {
	const privateKey = process.env.JWT_SECRET
	const expiresIn = process.env.JWT_EXPIRES_IN
	const token = jwt.sign(data, privateKey, {expiresIn})
	return token
}

const sendUserToken = (res, user) => {
	const token = generateToken({id: user.id})

	res.cookie('token', token, {
		expires: new Date(Date.now() + 360000),
		httpOnly: true,
	})

	res.status(200).json({
		email: user.email,
		username: user.name,
		role: user.role,
		token,
	})
}

const filterObj = (obj, fields = []) => {
	fields.forEach(field => {
		if (!obj.keys.includes(field)) return 
	})
}

class AuthController {
	login = asyncHandler(async (req, res, next) => {
		const {email, password} = req.body

		if (!email || !password) {
			throw new AppError('Please enter email or password', 404)
		}

		const user = await User.findOne({email}).select('+password +loginAttempts')
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
		sendUserToken(res, user)
	})

	register = asyncHandler(async (req, res, next) => {
		const {name, email, password, passwordConfirm} = req.body

		if (!name || !email || !password || !passwordConfirm) {
			throw new AppError('Please provide all fields', 400)
		}

		if (password !== passwordConfirm) {
			throw new AppError('Password confirm does not match', 400)
		}

		const existsUser = await User.findOne({email})
		if (existsUser) {
			throw new AppError('User already exists', 400)
		}

		const newUser = await User.create({name, email, password})
		sendUserToken(res, newUser)
	})

	authenticate = asyncHandler(async (req, res, next) => {
		let token
		const authHeader = req.headers['authorization']
		
		if (authHeader && authHeader.startsWith('Bearer ')) {
			token = authHeader.split(' ')[1]
		} else if (req.cookies.token) {
			token = req.cookies.token
		} else {
			throw new AppError('Not authorized, no token')
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		// Check user exsits
		const user = await User.findById(decoded.id).select('-password')
		if (!user) {
			throw new AppError('Token belongs to user no longer exists')
		}

		// Check user changed password after jwt generated
		const isValid = user.isPasswordChangeAfter(decoded.iat)
		if (isValid) {
			throw new AppError('Password is changed, login again', 401)
		}

		req.user = user
		next()
	})

	authorize = function (...roles) {
		return (req, res, next) => {
			if (!roles.includes(req.user.role))
				next(new AppError('Dont have permission', 401))
			next()
		}
	}

	forgotPassword = asyncHandler(async (req, res, next) => {
		// 1) Get user by email
		const user = await User.findOne({email: req.body.email})
		if (!user) next(new AppError('No user with that email address', 404))

		// 2) Generate reset token
		user.createRandomResetToken()
		await user.save({validateBeforeSave: false})
		console.log(__dirname)
		// 3) Send it back to user's email
		const options = {
			to: user.email,
			subject: 'Email reset password (validate in 10mins)',
			text: `Click the link below to reset password\n ${
				req.protocol
			}://${req.get('host')}${req.baseUrl}/resetPassword/${
				user.passwordResetToken
			}`,
		}

		try {
			await sendEmail(options)
			res.status(200).json({
				status: 'success',
				data: 'Email sent',
			})
		} catch (error) {
			user.passwordResetToken = undefined
			user.passwordResetExpires = undefined
			return next(error)
		}
	})

	resetPassword = asyncHandler(async (req, res, next) => {
		const token = req.params.token
		const {password, passwordConfirm} = req.body

		// Get user
		const user = await User.findOne({passwordResetToken: token})
		if (!user) {
			throw new AppError('Can not find user with that reset token', 404)
		}

		if (Date.now() > user.passwordResetExpires) {
			throw new AppError('Reset token is expired', 404)
		}

		user.password = password
		user.passwordResetToken = undefined
		user.passwordResetExpires = undefined
		await user.save()

		res.status(200).json({
			email: user.email,
			username: user.name,
			role: user.role,
			token: generateToken({id: user.id}),
		})
	})

	isLoggedIn = asyncHandler(async (req, res, next) => {
		if (req.cookies.token) {
			const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)

			const user = await User.findById(decoded.id).select('-password')
			if (!user) {
				return next()
			}

			const isValid = user.isPasswordChangeAfter(decoded.iat)
			if (isValid) {
				return next()
			}

			res.locals.user = user
		}

		next()
	})
}

module.exports = new AuthController()

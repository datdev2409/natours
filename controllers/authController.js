const User = require('../models/userModel');
const AppResponse = require('../utils/appResponse');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const AppError = require('../utils/appError');
const { promisify } = require('util');

exports.signup = catchAsync(async (req, res) => {
	// If use all data to create user, everybody can register a role as admin
	const data = req.body;
	const newUser = await User.create({
		name: data.name,
		email: data.email,
		password: data.password,
		passwordConfirm: data.passwordConfirm,
		passwordChangedAt: data.passwordChangedAt
	});

	// Generate JWT
	const privateKey = process.env.JWT_SECRET;
	const expiresIn = process.env.JWT_EXPIRES_IN;
	const token = jwt.sign({ id: newUser._id }, privateKey, { expiresIn });

	// Response data with JWT to client
	const jsonRes = new AppResponse('success', {
		jwt: token,
		user: newUser
	}).toJson();
	res.status(200).json(jsonRes);
});

exports.adminSignup = catchAsync(async (req, res) => {
	// If use all data to create user, everybody can register a role as admin
	const data = req.body;
	const newUser = await User.create({
		name: data.name,
		email: data.email,
		password: data.password,
		passwordConfirm: data.passwordConfirm
	});

	// Generate JWT
	const privateKey = process.env.JWT_SECRET;
	const expiresIn = process.env.JWT_EXPIRES_IN;
	const token = jwt.sign({ id: newUser._id }, privateKey, { expiresIn });

	// Response data with JWT to client
	const jsonRes = new AppResponse('success', {
		jwt: token,
		user: newUser
	}).toJson();
	res.status(200).json(jsonRes);
});

exports.signin = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		throw new AppError('Please enter email or password', 404);

	// password (select: false) can not be access by default
	const user = await User.findOne({ email }).select('+password');
	if (!user) throw new AppError('No user in DB', 404);

	const match = await user.verifyPassword(password, user.password);

	if (match) {
		const privateKey = process.env.JWT_SECRET;
		const expiresIn = process.env.JWT_EXPIRES_IN;
		const token = jwt.sign({ id: user._id }, privateKey, { expiresIn });
		const jsonRes = new AppResponse('success', {
			jwt: token
		}).toJson();
		res.status(200).json(jsonRes);
	} else throw new AppError("Password doesn't not match", 404);
});

exports.protect = catchAsync(async (req, res, next) => {
	// 1) Get JWT
	const authStr = req.headers.authorization;
	let token;
	if (authStr && authStr.startsWith('Bearer')) {
		token = authStr.split(' ')[1];
	}
	if (!token) throw new AppError('Please login', 401);

	// 2) Verify JWT
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	console.log(decoded);

	// 3) Check user exit
	const user = await User.findById(decoded.id);
	if (!user) throw new AppError('Token belongs to user no longer exists');

	// 4) Check password changed or not
	const isPasswordChangeAfter = user.isPasswordChangeAfter(decoded.iat);
	if (isPasswordChangeAfter)
		throw new Error('Password is changed, login again', 401);

	// Get JWT

	// Validate token
	next();
});

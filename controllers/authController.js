const User = require('../models/userModel');
const AppResponse = require('../utils/appResponse');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res) => {
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

	const user = await User.findOne({ email });
	if (!user) throw new AppError('No user in DB', 404);

	const match = await user.verifyPassword(password);

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

exports.checkAdmin = catchAsync(async (req, res, next) => {
	// Get JWT
	const token = req.headers.authorization || '';

	// Validate token
	next();
});

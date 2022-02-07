const User = require('../models/userModel');
const AppResponse = require('../utils/appResponse');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendUserToken = require('../utils/sendUserToken');
const filterObj = require('../utils/filterObj');

exports.getAllUsers = catchAsync(async (req, res) => {
	const users = await User.find({});
	const jsonRes = new AppResponse('success', { user: users }).toJson();
	res.status(200).json(jsonRes);
});

exports.getUser = catchAsync(async (req, res) => {
	const id = req.params.id;
	const user = await User.findById(id);
	const jsonRes = new AppResponse('success', { user: user }).toJson();
	res.status(200).json(jsonRes);
});

exports.deleteUser = catchAsync(async (req, res) => {
	const id = req.params.id;
	await User.findByIdAndDelete(id);
	const jsonRes = new AppResponse('success', { user: null }).toJson();
	res.status(204).json(jsonRes);
});

exports.updateUser = catchAsync(async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	const user = await User.updateOne({ _id: id }, data);
	const jsonRes = new AppResponse('success', { user: user }).toJson();
	res.status(200).json(jsonRes);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const { currentPassword, newPassword, passwordConfirm } = req.body;
	// Check old password
	if (!currentPassword)
		return next(new AppError('Please provide password', 403));

	const match = await user.verifyPassword(currentPassword, user.password);
	if (!match) {
		return next(new AppError("Password doesn't not match", 403));
	}

	user.password = newPassword;
	user.passwordConfirm = passwordConfirm;
	await user.save();

	res.status(200).json({
		status: 'success',
		message: 'Change password successfully'
	});
});

exports.updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.confirmPassword) {
		throw AppError('This route is not used for password update', 400);
	}

	const filteredObj = filterObj(req.body, ['name', 'email']);
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
		new: true,
		runValidators: true
	});

	const jsonRes = new AppResponse('success', { user: updatedUser });
	res.status(200).json(jsonRes);
});

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: 'success',
		data: null
	});
});

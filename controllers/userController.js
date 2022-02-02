const User = require('../models/userModel');
const AppResponse = require('../utils/appResponse');
const catchAsync = require('../utils/catchAsync');

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

exports.createUser = catchAsync(async (req, res) => {
	const data = req.body;
	const newUser = await User.create(data);
	const jsonRes = new AppResponse('success', { user: newUser }).toJson();
	res.status(200).json(jsonRes);
});

exports.deleteUser = catchAsync(async (req, res) => {
	const id = req.params.id;
	const user = await User.findByIdAndDelete(id);
	const jsonRes = new AppResponse('success', { user: null }).toJson();
	res.status(204).json(jsonRes);
});

exports.updateUser = catchAsync(async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	const user = await User.findByIdAndUpdate(id, data);
	const jsonRes = new AppResponse('success', { user: user }).toJson();
	res.status(200).json(jsonRes);
});

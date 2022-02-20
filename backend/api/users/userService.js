const User = require('./userModel');
const base = require('../../utils/baseService');

exports.getAllUsers = base.getAll(User);

exports.getUser = base.getOne(User);

exports.updateUser = base.updateOne(User);

exports.deleteUser = base.deleteOne(User);

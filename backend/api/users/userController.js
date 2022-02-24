const asyncHandler = require('express-async-handler');
const userService = require('./userService');
const uploadImgs = require('../../utils/uploadImage');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: 'success',
    data: {
      length: users.length,
      users,
    },
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUser(id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await userService.deleteUser(id);

  res.status(204).json({
    status: 'success',
  });
});

exports.uploadUserPhoto = uploadImgs({
  dir: 'backend/public/img/users',
  name: 'photo',
  maxCount: 1,
});

exports.updateUser = asyncHandler(async (req, res) => {
  // process file name when user upload image
  const { id } = req.params;
  const user = await userService.updateUser(id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

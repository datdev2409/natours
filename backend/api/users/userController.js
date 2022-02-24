const asyncHandler = require('express-async-handler');
const userService = require('./userService');
const {
  upload,
  resizeImgs,
  updateImgName,
} = require('../../utils/uploadImage');

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

exports.uploadUserPhoto = (req, res, next) => [
  upload.fields([{ name: 'photo', maxCount: 1 }]),
  resizeImgs('photo', {
    dir: 'backend/public/img/users',
    width: 500,
    height: 500,
    quality: 90,
    multiple: false,
  }),
  updateImgName,
];

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

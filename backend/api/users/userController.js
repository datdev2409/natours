const asyncHandler = require('express-async-handler');
const userService = require('./userService');

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

exports.updateUser = asyncHandler(async (req, res) => {
  // process file name when user upload image
  if (req.file) {
    const photoPath = req.file.filename;
    req.body.photo = photoPath;
  }

  const { id } = req.params;
  const user = await userService.updateUser(id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// class UserController {
//   getMe = (req, res, next) => {
//     req.params.id = req.user.id;
//     console.log('User id: ', req.user.id);
//     next();
//   };

//   getUser = factory.getOne(User, 'reviews');
//   getAllUsers = factory.getAll(User);
//   updateUser = factory.updateOne(User);
//   deleteUser = factory.deleteOne(User);
// }

// module.exports = new UserController();

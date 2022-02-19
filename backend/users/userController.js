const userService = require('./userService');
const asyncHandler = require('express-async-handler');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: 'success',
    data: {
      length: users.length,
      users: users,
    },
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await userService.getUser(id);

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await userService.deleteUser(id);

  res.status(204).json({
    status: 'success',
  });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await userService.updateUser(id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
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

const authService = require('./authService');
const asyncHandler = require('express-async-handler');

const sendUserToken = (res, user) => {
  const expiresAfter = 360000;
  res.cookie('token', user.token, {
    expires: new Date(Date.now() + expiresAfter),
    httpOnly: true,
  });

  res.status(200).json({
    name: user.name,
    email: user.email,
  });
};

exports.register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  sendUserToken(res, user);
});

exports.login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body);

  console.log(user);
  sendUserToken(res, user);
});

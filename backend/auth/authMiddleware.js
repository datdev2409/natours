const { body, validationResult } = require('express-validator');
const AppError = require('../utils/appError');
const asyncHandler = require('express-async-handler');
const authService = require('./authService');

const validatePasswords = (req, res, next) => {
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  if (password !== passwordConfirm) {
    return next(new AppError("Password doesn't not match", 403));
  }
  next();
};

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  next();
};

exports.validate = (method) => {
  switch (method) {
    case 'register': {
      return [
        body('name', "userName doesn't exists").exists(),
        body('email', 'Invalid email').exists().isEmail(),
        body('password', "Password doesn't exists").exists(),
        body('passwordConfirm').exists(),
        validatePasswords,
        handleErrors,
      ];
    }

    case 'login': {
      return [
        body('email', 'Invalid email').exists().isEmail(),
        body('password', "Password doesn't exists").exists(),
        handleErrors,
      ];
    }
  }
};

exports.protect = asyncHandler(async (req, res, next) => {
  const user = await authService.protect(req.body, req.cookies);

  req.user = user;
  next();
});

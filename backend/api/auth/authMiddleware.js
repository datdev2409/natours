const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const authService = require('./authService');

const validatePasswords = (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) {
    return next(createError(403, "Password doesn't not match"));
  }
  return next();
};

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  return next();
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

    default: {
      return [];
    }
  }
};

exports.protect = asyncHandler(async (req, res, next) => {
  const user = await authService.protect(req.body, req.cookies);

  req.user = user;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(createError(403, "Don't have permission to access"));
    }
    return next();
  };

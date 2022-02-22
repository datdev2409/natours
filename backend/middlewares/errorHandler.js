const AppError = require('../utils/appError');

// function renderErrPage(err, res) {}

function sendErrProd(err, req, res) {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // Know error, when we throw new AppError
      res.status(statusCode).json({
        status,
        message: err.message,
      });

      // Unknown error
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  } else if (err.isOperational) {
    res.render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  } else {
    res.render('error', {
      title: 'Something went wrong',
      msg: 'Please try again later.',
    });
  }
}

function sendErrDev(err, req, res) {
  // 1 - Log error
  console.error(err);
  // 2 - Response
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  if (req.originalUrl.startsWith('/api')) {
    res.status(statusCode).json({
      status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  res.render('error', {
    tilte: 'Something went wrong',
    msg: err.message,
  });
}

function hanldeDuplicateFieldDB(err, res) {
  const message = `${err.keyValue.name} is already exists`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
  return new AppError(err.message, 400);
}

function handleCastErrorDB(err) {
  const message = `Can not find ${err.kind} with value ${err.value}`;
  return new AppError(message, 400);
}

function handleJWTError() {
  const message = `JWT is not valid`;
  return new AppError(message, 401);
}

function handleExpiredJWT() {
  const message = `JWT is expired, please login again`;
  return new AppError(message, 401);
}

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else {
    let customErr = err;
    if (err.name === 'CastError') {
      customErr = handleCastErrorDB(err);
    } else if (err.code === 11000) {
      customErr = hanldeDuplicateFieldDB(err);
    } else if (err.name === 'ValidationError') {
      customErr = handleValidationErrorDB(err);
    } else if (err.name === 'JsonWebTokenError') {
      customErr = handleJWTError();
    } else if (err.name === 'TokenExpiredError') {
      customErr = handleExpiredJWT();
    }
    sendErrProd(customErr, req, res);
  }
};

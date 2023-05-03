const { json } = require('express');
const AppError = require('../utils/appError');

function sendErrProd(err, res) {
	if (err.isOperational) {
		// Know error, when we throw new AppError
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});

		// Unknown error
	} else {
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong'
		});
	}
}

function sendErrDev(err, res) {
	// 1 - Log error
	console.error(err);
	// 2 - Response
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
		error: err
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
	const error = { ...err };
	const message = `Can not find ${error.kind} with value ${error.value}`;
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
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	if (process.env.NODE_ENV == 'development') {
		sendErrDev(err, res);
	} else {
		if (err.name == 'CastError') {
			err = handleCastErrorDB(err);
		} else if (err.code == 11000) {
			err = hanldeDuplicateFieldDB(err);
		} else if (err.name == 'ValidationError') {
			err = handleValidationErrorDB(err);
		} else if (err.name == 'JsonWebTokenError') {
			err = handleJWTError();
		} else if (err.name == 'TokenExpiredError') {
			err = handleExpiredJWT();
		}
		sendErrProd(err, res);
	}
};

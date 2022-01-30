function sendErrProd(err, res) {
	// Know error, when we throw new AppError
	if (err.isOperational) {
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

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	if (process.env.NODE_ENV == 'development') {
		sendErrDev(err, res);
	} else {
		sendErrProd(err, res);
	}
};

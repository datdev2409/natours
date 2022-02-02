const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const errorHanlder = require('./middlewares/errorHandler');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
require('dotenv').config();

// handle uncaught exception
process.on('uncaughtException', err => {
	console.error('Uncaught exception', err.name, err.message);
	process.exit(1);
});

const app = express();

// Connect DB
connectDB();

async function connectDB() {
	const DB = process.env.DB || 'mongodb://localhost:27017/test';
	await mongoose.connect(DB.replace('<PASSWORD>', process.env.DB_PASSWORD));
	console.log('Connect DB successfully');
}

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// unhandeled routes
app.all('*', (req, res) => {
	res.status(404).json({
		status: 'fail',
		message: `Can't find ${req.originalUrl} on this server`
	});
});

app.use(errorHanlder);

// Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`Server is running at ${port}`);
});

// Handle unhandled rejection
process.on('unhandledRejection', err => {
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

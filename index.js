const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const errorHanlder = require('./middlewares/errorHandler');
const tourRouter = require('./routes/tourRoutes');
require('dotenv').config();

const app = express();

// Connect DB
connectDB().catch(err => console.log(err));

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
app.all('*', (req, res) => {
	res.status(404).json({
		status: 'fail',
		message: `Can't find ${req.originalUrl} on this server`
	});
});

app.use(errorHanlder);

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running at ${port}`);
});

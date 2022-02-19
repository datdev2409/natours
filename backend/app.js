const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const errorHanlder = require('./middlewares/errorHandler');
const DB = require('./config/db');
const path = require('path');

// Security middleware
const hpp = require('hpp');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Router
const tourRouter = require('./tours').tourRoutes;
const userRouter = require('./users').userRoutes;
const reviewRouter = require('./reviews').reviewRoutes;
const authRouter = require('./auth').routes;
// const viewRouter = require('./routes/viewRouter');

// handle uncaught exception
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err.name, err.message);
  process.exit(1);
});

const app = express();

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static file
app.use(express.static(path.join(__dirname, 'public')));

// Database connect
DB.connect();

// Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many request from this IP, please try in 15 minutes',
});

app.use(limiter);
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

// protect against HTTP Parameter Pollution attacks
const whitelist = ['duration', 'difficulty', 'price'];
app.use(hpp({ whitelist }));

// app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/auth', authRouter);

// unhandeled routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

app.use(errorHanlder);

// Handle unhandled rejection
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;

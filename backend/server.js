const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const errorHanlder = require('./middlewares/errorHandler')

// Security middleware
const hpp = require('hpp')
const xss = require('xss-clean')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')

// Router
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const authRouter = require('./routes/authRoutes')
const reviewRouter = require('./routes/reviewRoutes')

// handle uncaught exception
process.on('uncaughtException', err => {
	console.error('Uncaught exception', err.name, err.message)
	process.exit(1)
})

const app = express()

// Connect DB
connectDB()

async function connectDB() {
	const DB = process.env.DB || 'mongodb://localhost:27017/test'
	await mongoose.connect(DB.replace('<PASSWORD>', process.env.DB_PASSWORD))
	console.log('Connect DB successfully')
}

// Middleware
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: 'Too many request from this IP, please try in 15 minutes'
})

app.use(helmet())
app.use(limiter)
app.use(morgan('dev'))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(mongoSanitize())
app.use(xss())
app.use(
	hpp({
		whitelist: ['duration', 'difficulty', 'price']
	})
)

// Routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/reviews', reviewRouter)
// unhandeled routes
app.all('*', (req, res) => {
	res.status(404).json({
		status: 'fail',
		message: `Can't find ${req.originalUrl} on this server`
	})
})

app.use(errorHanlder)

// Server
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
	console.log(`Server is running at ${port}`)
})

// Handle unhandled rejection
process.on('unhandledRejection', err => {
	console.log(err.name, err.message)
	server.close(() => {
		process.exit(1)
	})
})

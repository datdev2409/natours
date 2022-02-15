const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const errorHanlder = require('./middlewares/errorHandler')
const DB = require('./config/db')
const path = require('path')

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

// Set view engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Serving static file
app.use(express.static(path.join(__dirname, 'public')))

// Database connect
DB.connect()

// Middleware
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100, 
	standardHeaders: true, 
	legacyHeaders: false, 
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
app.get('/', (req, res) => {
	res.status(200).render('base', {
		tour: 'The Forest Striker',
		user: 'Cong Dat'
	})
})


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

const mongoose = require('mongoose')
const env = require('dotenv').config()

async function connect() {
	let DB = process.env.DB || 'mongodb://localhost:27017/test'
	DB = DB.replace('<USERNAME>', process.env.DB_USERNAME)
	DB = DB.replace('<PASSWORD>', process.env.DB_PASSWORD)
	await mongoose.connect(DB)
	console.log('Database connected!!')
}

module.exports = { connect: connect }
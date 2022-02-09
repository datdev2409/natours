const fs = require('fs')
const mongoose = require('mongoose')
const Tour = require('../models/tourModel')
const dotenv = require('dotenv').config()

// Read data from file
const filePath = `${__dirname}/../dev-data/data/tours.json`
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
// Connect DB
connectDB().catch(err => console.log(err))

async function connectDB() {
	let DB = process.env.DB || 'mongodb://localhost:27017/test'
	DB = DB.replace('<USERNAME>', process.env.DB_USERNAME)
	DB = DB.replace('<PASSWORD>', process.env.DB_PASSWORD)
	await mongoose.connect(DB)
	console.log('Database connected!!')
}

// Function handler
const addToDB = async data => {
	await Tour.insertMany(data)
	process.exit()
}

const cleanDB = async data => {
	await Tour.deleteMany()
	process.exit()
}

addToDB(data)

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
	console.log(process.env.DB)
	const DB = process.env.DB || 'mongodb://localhost:27017/test'
	await mongoose.connect(DB.replace('<PASSWORD>', process.env.DB_PASSWORD))
	console.log('Connect DB successfully')
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

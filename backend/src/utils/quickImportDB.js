const fs = require('fs')
const mongoose = require('mongoose')
const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const Review = require('../models/reviewModel')
const dotenv = require('dotenv').config()
const bcrypt = require('bcrypt')
const slugify = require('slugify')
const {connect} = require('../config/db')

// Read data from file
const tourPath = `${__dirname}/../dev-data/data/tours.json`
const reviewPath = `${__dirname}/../dev-data/data/reviews.json`
const userPath = `${__dirname}/../dev-data/data/users.json`
let tourData = JSON.parse(fs.readFileSync(tourPath, 'utf-8'))
const reviewData = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'))
const userData = JSON.parse(fs.readFileSync(userPath, 'utf-8'))
// Connect DB

connect()

tourData = tourData.map(tour => 
	{
		return {
			...tour,
			slug:	slugify(tour.name, { lower: true })
		}
	}
)

console.log(tourData);
// Function handler
const addToDB = async (tourData, userData, reviewData) => {
	await Tour.insertMany(tourData)
	// await User.insertMany(userData)
	await Review.insertMany(reviewData)
	process.exit()
}

const cleanDB = async data => {
	await Tour.deleteMany()
	// await User.deleteMany()
	await Review.deleteMany()
	process.exit()
}

userData.forEach(user => {
	user.password = bcrypt.hashSync('pass1234', 12)
	user.passwordConfirm = user.password
})

cleanDB()
addToDB(tourData, userData, reviewData)

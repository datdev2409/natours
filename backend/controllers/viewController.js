const Tour = require('../models/tourModel')
const asyncHandler = require('express-async-handler')

exports.getOverview = asyncHandler( async (req, res) => {
  const tours = await Tour.find({})

	res.status(200).render('overview', {
		title: 'All Tours',
    tours: tours
	})
})

exports.getTour = (req, res) => {
	res.status(200).render('overview', {
		title: 'All Tours'
	})
}
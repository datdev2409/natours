const Review = require('../models/reviewModel')
const asyncHandler = require('express-async-handler')
const factory = require('./factoryController')

class ReviewController {
	handleInput = asyncHandler(async (req, res, next) => {
		const userId = req.user.id
		const tourId = req.body.tour ? req.body.tour : req.params.tourId
		req.body = Object.assign(req.body, { user: userId, tour: tourId })
		next()
	})

	createReview = factory.createOne(Review)
	getReview = factory.getOne(Review)
	getAllReviews = factory.getAll(Review)
	updateReview = factory.updateOne(Review)
	deleteReview = factory.deleteOne(Review)
}

module.exports = new ReviewController()

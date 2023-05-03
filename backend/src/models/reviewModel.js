// review, rating, tour, user
const mongoose = require('mongoose')
const Tour = require('../models/tourModel')
const AppError = require('../utils/appError')

const reviewSchema = mongoose.Schema({
	review: {
		type: String,
		require: [true, 'Review can not be empty']
	},
	rating: {
		type: Number,
		min: [1, 'Rating must be equal or greater than 1'],
		max: [5, 'Rating must be equal or lower than 5']
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	tour: {
		type: mongoose.Schema.ObjectId,
		ref: 'Tour',
		requrie: [true, 'Review must belong to a tour']
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		requrie: [true, 'Review must belong to a user']
	}
})

reviewSchema.set('toJson', { virtuals: true })
reviewSchema.set('toObject', { virtuals: true })

// CREATE INDEXES
reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.statics.calcAverageRatings = async function (tourId) {
	const stats = await this.aggregate()
		.match({ tour: tourId })
		.group({
			_id: '$tour',
			nRatings: { $sum: 1 },
			avgRating: { $avg: '$rating' }
		})

	await Tour.findByIdAndUpdate(tourId, {
		ratingsAverage: stats[0] ? stats[0].avgRating : 4.5,
		ratingsQuantity: stats[0] ? stats[0].nRatings : 0
	})
}

// QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } })
	this.populate({ path: 'user', select: 'name email photo role' })
	next()
})

reviewSchema.pre(/^findOneAnd/, async function () {
	const review = await this.clone().findOne()
	this.tourId = review.tour
})

reviewSchema.post(/^findOneAnd/, async function () {
	await Review.calcAverageRatings(this.tourId)
})

reviewSchema.post('save', async function () {
	Review.calcAverageRatings(this.tour)
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review

// review, rating, tour, user
const mongoose = require('mongoose')

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
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		requrie: [true, 'Review must belong to a user']
	}
})

reviewSchema.set('toJson', { virtuals: true })
reviewSchema.set('toObject', { virtuals: true })

// QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function () {
	this.populate({
		path: 'author',
		select: 'name photo'
	})
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review

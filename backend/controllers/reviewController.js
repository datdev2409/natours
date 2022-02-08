const Review = require('../models/reviewModel')
const AppError = require('../utils/appError')
const filterObj = require('../utils/filterObj')
const asyncHandler = require('express-async-handler')

// @desc		Create review
// @route		POST /reviews/
// @access	Public
const createReview = asyncHandler(async (req, res, next) => {
	const userId = req.user.id
	const data = filterObj(req.body, ['review', 'rating', 'tour'])
	const review = await Review.create(Object.assign(data, { author: userId }))
	res.status(200).json({ status: 'success', review: review })
})

// @desc		Get all reviews
// @route		GET /reviews/
// @access	Private (admin)
const getAllReviews = asyncHandler(async (req, res, next) => {
	const reviews = await Review.find({})
	res.status(200).json({ status: 'success', review: reviews })
})

// @desc		Get review
// @route		GET /review/:id
// @access	Private (admin)
const getReview = asyncHandler(async (req, res, next) => {
	const id = req.params.id
	const review = await Review.findById(id)
	res.status(200).json({ status: 'success', review: review })
})

// @desc		Delete review
// @route		DELETE /review/:id
// @access	Private
const deleteReview = asyncHandler(async (req, res, next) => {
	const id = req.params.id
	const userId = req.user.id
	const authorId = (await Review.findById(id)).author.id
	if (userId != authorId) throw new AppError("You don't have permission", 403)
	await Review.findByIdAndDelete(id)
	res.status(204).json({ status: 'success' })
})

// @desc		Update review
// @route		PATCH /review/:id
// @access	Private
const updateReview = asyncHandler(async (req, res, next) => {
	const id = req.params.id
	const userId = req.user.id
	const authorId = (await Review.findById(id)).author.id
	if (authorId != userId) throw new AppError("You don't have permission", 403)
	const data = filterObj(req.body, ['review', 'rating'])
	const review = await Review.findByIdAndUpdate(id, data, { new: true })
	res.status(200).json({ status: 'success', review: review })
})

module.exports = {
	createReview,
	getAllReviews,
	getReview,
	deleteReview,
	updateReview
}

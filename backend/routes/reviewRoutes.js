const express = require('express')
const router = express.Router({ mergeParams: true })
const reviewController = require('../controllers/reviewController')
const { authenticate, authorize } = require('../controllers/authController')

router
	.route('/')
	.get(authenticate, reviewController.getAllReviews)
	.post(
		authenticate,
		reviewController.handleInput,
		reviewController.createReview
	)

router
	.route('/:id')
	.get(reviewController.getReview)
	.delete(authenticate, reviewController.deleteReview)
	.patch(authenticate, reviewController.updateReview)

module.exports = router

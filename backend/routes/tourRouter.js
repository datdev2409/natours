const express = require('express')
const router = express.Router()
const tourController = require('../controllers/tourController')
const tourMiddleware = require('../middlewares/tourMiddleware')
const { authenticate, authorize } = require('../controllers/authController')
const reviewRouter = require('../routes/reviewRouter')

router
	.route('/top-5-cheap')
	.get(tourMiddleware.aliasTopCheapTour, tourController.getAllTours)

// router.get('/stats', tourController.getStats)
// router.get('/monthly-plan/:year', tourController.getMonthlyPlan)

router
	.route('/')
	.get(tourController.getAllTours)
	.post(tourController.createTour)

router.use('/:tourId/reviews', reviewRouter)

router.get('/near', tourController.getNearLocations)
router.route('/distances/:latlng/:unit').get(tourController.getDistances)

router
	.route('/:id')
	.get(tourController.getTour)
	.delete(tourController.deleteTour)
	.patch(tourController.updateTour)

// POST /tours/:tourId/reviews/
module.exports = router

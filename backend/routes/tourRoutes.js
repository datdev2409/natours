const express = require('express')
const router = express.Router()
const tourController = require('../controllers/tourController')
const tourMiddleware = require('../middlewares/tourMiddleware')
const { authenticate, authorize } = require('../controllers/authController')

router
	.route('/top-5-cheap')
	.get(tourMiddleware.aliasTopCheapTour, tourController.getAllTours)

router.get('/stats', tourController.getStats)
router.get('/monthly-plan/:year', tourController.getMonthlyPlan)

router.get('/', authenticate, tourController.getAllTours)
router.post('/', tourController.createTour)

router
	.route('/:id')
	.get(tourController.getTour)
	.delete(
		authenticate,
		authorize('admin', 'lead-guide'),
		tourController.deleteTour
	)
	.patch(tourController.updateTour)

module.exports = router

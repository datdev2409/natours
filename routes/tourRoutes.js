const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const tourMiddleware = require('../middlewares/tourMiddleware');
const authController = require('../controllers/authController');

router
	.route('/top-5-cheap')
	.get(tourMiddleware.aliasTopCheapTour, tourController.getAllTours);

router.get('/stats', tourController.getStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router.get('/', tourController.getAllTours);
router.post('/', tourController.createTour);

router
	.route('/:id')
	.get(tourController.getTour)
	.delete(
		authController.protect,
		authController.restrictTo('admin', 'lead-guide'),
		tourController.deleteTour
	)
	.patch(tourController.updateTour);

module.exports = router;

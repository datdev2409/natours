const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const tourMiddleware = require('../middlewares/tourMiddleware');

router
	.route('/top-5-cheap')
	.get(tourMiddleware.aliasTopCheapTour, tourController.getAllTours);

router.get('/stats', tourController.getStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router.get('/', tourController.getAllTours);
router.post('/', tourController.createTour);

router.get('/:id', tourController.getTour);
router.delete('/:id', tourController.deleteTour);
router.patch('/:id', tourController.updateTour);

module.exports = router;

const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourControllers');

router.get('/', tourController.getAllTours);
router.post('/', tourController.createTour);

router.get('/:id', tourController.getTour);
router.delete('/:id', tourController.deleteTour);
router.patch('/:id', tourController.updateTour);

module.exports = router;

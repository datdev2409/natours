const router = require('express').Router();
const tourController = require('./tourController');
const { protect } = require('../auth').middleware;
// const tourMiddleware = require('./tourMiddleware');

router
  .route('/')
  .get(protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .delete(tourController.deleteTour)
  .patch(tourController.updateTour);

// router.use('/:tourId/reviews', reviewRouter);

// router.get('/near', tourController.getNearLocations);
// router.route('/distances/:latlng/:unit').get(tourController.getDistances);

// POST /tours/:tourId/reviews/
module.exports = router;

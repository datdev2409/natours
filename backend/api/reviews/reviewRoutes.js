const router = require('express').Router();
const reviewController = require('./reviewController');

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

// router.use(reviewController.getMe);
// router
//   .route('/me')
//   .get(reviewController.getReview)
//   .patch(reviewController.updateReview)
//   .delete(reviewController.deleteReview);

module.exports = router;

const asyncHandler = require('express-async-handler');
const reviewService = require('./reviewService');

exports.getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getAllReviews();

  res.status(200).json({
    status: 'success',
    data: {
      length: reviews.length,
      reviews,
    },
  });
});

exports.getReview = asyncHandler(async (req, res) => {
  const { id } = req.params.id;
  const review = await reviewService.getReview(id);

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params.id;
  await reviewService.deleteReview(id);

  res.status(204).json({
    status: 'success',
  });
});

exports.updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params.id;
  const review = await reviewService.updateReview(id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.createReview = asyncHandler(async (req, res) => {
  const { id } = req.params.id;
  const review = await reviewService.createReview(id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

// class ReviewController {
//   getMe = (req, res, next) => {
//     req.params.id = req.review.id;
//     console.log('Review id: ', req.review.id);
//     next();
//   };

//   getReview = factory.getOne(Review, 'reviews');
//   getAllReviews = factory.getAll(Review);
//   updateReview = factory.updateOne(Review);
//   deleteReview = factory.deleteOne(Review);
// }

// module.exports = new ReviewController();

const reviewService = require('./reviewService');
const asyncHandler = require('express-async-handler');

exports.getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getAllReviews();

  res.status(200).json({
    status: 'success',
    data: {
      length: reviews.length,
      reviews: reviews,
    },
  });
});

exports.getReview = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const review = await reviewService.getReview(id);

  res.status(200).json({
    status: 'success',
    data: {
      review: review,
    },
  });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await reviewService.deleteReview(id);

  res.status(204).json({
    status: 'success',
  });
});

exports.updateReview = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const review = await reviewService.updateReview(id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      review: review,
    },
  });
});

exports.createReview = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const review = await reviewService.createReview(id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      review: review,
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

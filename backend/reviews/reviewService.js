const Review = require('./reviewModel');
const base = require('../utils/baseService');

exports.getAllReviews = base.getAll(Review);

exports.getReview = base.getOne(Review);

exports.updateReview = base.updateOne(Review);

exports.deleteReview = base.deleteOne(Review);

exports.createReview = base.createOne(Review);

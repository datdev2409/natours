const asyncHandler = require('express-async-handler');
const tourService = require('./tourService');

exports.getAllTours = asyncHandler(async (req, res) => {
  const tours = await tourService.getAllTours();

  res.status(200).json({
    status: 'success',
    data: {
      length: tours.length,
      tours,
    },
  });
});

exports.createTour = asyncHandler(async (req, res) => {
  const tour = await tourService.createTour(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.getTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tour = await tourService.getTour(id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await tourService.deleteTour(id);

  res.status(204).json({
    status: 'success',
  });
});

exports.updateTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tour = await tourService.updateTour(id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// const Tour = require('../models/tourModel');
// const APIFeatures = require('../utils/apiFeatures');
// const factory = require('./factoryController');
// const asyncHandler = require('express-async-handler');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// class TourController {
//   createTour = factory.createOne(Tour);
//   getTour = factory.getOne(Tour, 'reviews');
//   getAllTours = factory.getAll(Tour);
//   updateTour = factory.updateOne(Tour);
//   deleteTour = factory.deleteOne(Tour);

//   getNearLocations = asyncHandler(async (req, res, next) => {
//     const { long, lat } = req.query;
//     const locations = await Tour.find({
//       startLocation: {
//         $near: {
//           $geometry: {
//             type: 'Point',
//             coordinates: [long * 1, lat * 1],
//           },
//           $maxDistance: 1000 * 100,
//         },
//       },
//     });
//     res.status(200).json({ status: 'success', data: locations });
//   });

//   getDistances = asyncHandler(async (req, res, next) => {
//     const { latlng, unit } = req.params;
//     const [lat, lng] = latlng.split(',');
//     const multiplier = unit == 'mi' ? 0.000621371 : 0.001;

//     if (!lat || !lng)
//       return next(
//         new AppError(
//           'Please provide latitude and longitude in the format lat,lng',
//           400
//         )
//       );

//     const distances = await Tour.aggregate([
//       {
//         $geoNear: {
//           near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
//           key: 'startLocation',
//           distanceField: 'distance',
//           distanceMultiplier: multiplier,
//         },
//       },
//       {
//         $project: {
//           distance: 1,
//           name: 1,
//         },
//       },
//     ]);
//     res.status(200).json({ status: 'success', data: distances });
//   });
// }

// module.exports = new TourController();

// exports.getStats = catchAsync(async (req, res, next) => {
//   const stats = await Tour.aggregate([
//     {
//       $match: { ratingsAverage: { $gte: 4.5 } },
//     },
//     {
//       $group: {
//         _id: '$difficulty',
//         numTours: { $sum: 1 },
//         avgRating: { $avg: '$ratingsAverage' },
//         avgPrice: { $avg: '$price' },
//         minPrice: { $min: '$price' },
//         maxPrice: { $max: '$price' },
//       },
//     },
//     {
//       $sort: {
//         avgPrice: 1,
//         avgRating: -1,
//       },
//     },
//     {
//       $match: {
//         _id: { $ne: 'easy' },
//       },
//     },
//   ]);
//   res.json(stats);
// });

// exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
//   const monthlyPlan = await Tour.aggregate([
//     { $unwind: '$startDates' },
//     {
//       $group: {
//         _id: { $month: '$startDates' },
//         name: { $push: '$name' },
//         numTours: { $sum: 1 },
//       },
//     },
//     {
//       $addFields: {
//         month: '$_id',
//       },
//     },
//     { $sort: { _id: 1 } },
//   ]);

//   res.json(monthlyPlan);
// });

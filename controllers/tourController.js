const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

function createResponse(status, data, message = '') {
	return { status, data, message };
}

function catchAsync(fn) {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
}

exports.getAllTours = catchAsync(async (req, res, next) => {
	const options = ['all'];
	const features = new APIFeatures(Tour.find(), req.query, options);
	const tours = await features.query;
	const responseData = {
		status: 'success',
		data: {
			numTours: tours.length,
			tour: tours
		}
	};
	res.status(200).json(responseData);
});

exports.getTour = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const tour = await Tour.findById(id);
	if (!tour) throw new AppError('No tour found with that id', 404);
	res.status(200).json(createResponse('success', { tour }, ''));
});

exports.createTour = catchAsync(async (req, res, next) => {
	const newTour = await Tour.create(req.body);
	res.status(200).json(createResponse('success', { tour: newTour }, ''));
});

exports.updateTour = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const updatedTour = await Tour.findByIdAndUpdate(id, req.body);
	if (!updatedTour) throw new AppError('No tour found with that id', 404);
	res.status(200).json(createResponse('success', { tour: updatedTour }));
});

exports.deleteTour = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const deletedTour = await Tour.findByIdAndDelete(id);
	if (!deletedTour) throw new AppError('No tour found with that id', 404);
	res.status(204).json(createResponse('success', null));
});

exports.getStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{
			$match: { ratingsAverage: { $gte: 4.5 } }
		},
		{
			$group: {
				_id: '$difficulty',
				numTours: { $sum: 1 },
				avgRating: { $avg: '$ratingsAverage' },
				avgPrice: { $avg: '$price' },
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' }
			}
		},
		{
			$sort: {
				avgPrice: 1,
				avgRating: -1
			}
		},
		{
			$match: {
				_id: { $ne: 'easy' }
			}
		}
	]);
	res.json(stats);
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
	const monthlyPlan = await Tour.aggregate([
		{ $unwind: '$startDates' },
		{
			$group: {
				_id: { $month: '$startDates' },
				name: { $push: '$name' },
				numTours: { $sum: 1 }
			}
		},
		{
			$addFields: {
				month: '$_id'
			}
		},
		{ $sort: { _id: 1 } }
	]);

	res.json(monthlyPlan);
});

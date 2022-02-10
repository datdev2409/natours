const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const factory = require('./factoryController')
const catchAsync = require('../utils/catchAsync')

class TourController {
	createTour = factory.createOne(Tour)
	getTour = factory.getOne(Tour)
	getAllTours = factory.getAll(Tour)
	updateTour = factory.updateOne(Tour)
	deleteTour = factory.deleteOne(Tour)
}

module.exports = new TourController()

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
	])
	res.json(stats)
})

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
	])

	res.json(monthlyPlan)
})

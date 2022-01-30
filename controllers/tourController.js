const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

function createResponse(status, data, message = '') {
	return { status, data, message };
}

class TourController {
	async getAllTours(req, res) {
		try {
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
		} catch (error) {
			console.log(error);
			res.status(404).json(createResponse('fail', '', error));
		}
	}

	async createTour(req, res) {
		try {
			const newTour = await Tour.create(req.body);
			res.status(200).json(createResponse('success', { tour: newTour }, ''));
		} catch (error) {
			res.status(404).json(createResponse('fail', '', error));
		}
	}

	async getTour(req, res) {
		try {
			const id = req.params.id;
			const tour = await Tour.findById(id);
			res.status(200).json(createResponse('success', { tour }, ''));
		} catch (error) {
			res.status(404).json(createResponse('fail', '', 'Invalid tour id'));
		}
	}

	async updateTour(req, res) {
		try {
			const id = req.params.id;
			const updatedTour = await Tour.findByIdAndUpdate(id, req.body);
			res.status(200).json(createResponse('success', { tour: updatedTour }));
		} catch (error) {
			res.status(404).json(createResponse('fail', '', error));
		}
	}

	async deleteTour(req, res) {
		try {
			const id = req.params.id;
			await Tour.findByIdAndDelete(id);
			res.status(204).json(createResponse('success', null));
		} catch (error) {
			res.status(404).json(createResponse('fail', '', error));
		}
	}

	async getStats(req, res) {
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
	}

	async getMonthlyPlan(req, res) {
		try {
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
		} catch (error) {
			res.status(404).json(error);
		}
	}
}

module.exports = new TourController();

const Tour = require('../models/tourModel');

function createResponse(status, data, message = '') {
	return { status, data, message };
}

class TourController {
	async getAllTours(req, res) {
		try {
			const query = await Tour.find({});
			res.status(200).json(createResponse('success', { tour: query }));
		} catch (error) {
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
			const deletedTour = await Tour.findByIdAndDelete(id);
			res.status(204).json(createResponse('success', null));
		} catch (error) {
			res.status(404).json(createResponse('fail', '', error));
		}
	}
}

module.exports = new TourController();

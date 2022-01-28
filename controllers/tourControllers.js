const Tour = require('../models/tourModel');

class TourController {
	async getAllTours(req, res) {
		const query = await Tour.find({});
		res.json(query);
		// res.send('get all tours');
	}

	async createTour(req, res) {
		Tour.create(req.body);
		res.send('create tour');
	}

	getTour(req, res) {
		const id = req.params.id;
		res.send('get tour');
	}

	updateTour(req, res) {
		res.send('update tour');
	}

	deleteTour(req, res) {
		res.send('delete tour');
	}
}

module.exports = new TourController();

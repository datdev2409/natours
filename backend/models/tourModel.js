const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true,
		trim: true,
		maxlength: [40, 'A tour name must have less or equal then 40 characters'],
		minlength: [10, 'A tour name must have more or equal then 10 characters']
	},
	duration: {
		type: Number,
		required: [true, 'A tour must have a duration']
	},
	maxGroupSize: {
		type: Number,
		required: [true, 'A tour must have a group size']
	},
	difficulty: {
		type: String,
		required: [true, 'A tour must have a difficulty'],
		enum: {
			values: ['easy', 'medium', 'difficult'],
			message: 'Difficulty is either: easy, medium, difficult'
		}
	},
	ratingsAverage: {
		type: Number,
		default: 4.5,
		min: [1, 'Rating must be above 1.0'],
		max: [5, 'Rating must be below 5.0']
	},
	ratingsQuantity: { type: Number, default: 0 },
	price: { type: Number, required: [true, 'A tour must have a price'] },
	summary: {
		type: String,
		trim: true,
		required: [true, 'A tour must have a description']
	},
	description: {
		type: String,
		trim: true
	},
	imageCover: {
		type: String,
		required: [true, 'A tour must have a cover image']
	},
	images: [String],
	startDates: [Date],
	createdAt: {
		type: Date,
		default: Date.now()
		// select: false
	}
});
tourSchema.set('toJSON', { virtuals: true });
tourSchema.set('toObject', { virtuals: true });

tourSchema.virtual('dateDiff').get(function () {
	const milisecPerDay = 24 * 60 * 60 * 1000;
	return (Date.now() - this.createdAt) / milisecPerDay;
});

tourSchema.virtual('durationWeek').get(function () {
	return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
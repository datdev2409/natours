const AppError = require('../utils/appError');
const Tour = require('./tourModel');

exports.getAllTours = async () => {
  const tours = await Tour.find({});
  return tours;
};

exports.createTour = async (body) => {
  const tour = await Tour.create(body);
  return tour;
};

exports.getTour = async (id) => {
  const tour = await Tour.findById(id).populate('reviews');
  if (!tour) throw new AppError('No tour found with id', 404);
  return tour;
};

exports.deleteTour = async (id) => {
  await Tour.findByIdAndRemove(id);
};

exports.updateTour = async (id, body) => {
  const tour = await Tour.findByIdAndUpdate(id, body, {
    returnDocument: 'after',
  });

  return tour;
};

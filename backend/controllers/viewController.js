const Tour = require('../models/tourModel')
const asyncHandler = require('express-async-handler')

exports.getOverview = asyncHandler( async (req, res) => {
  const tours = await Tour.find({})

  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours
  })
})

exports.getTour = asyncHandler(async (req, res) => {
  const slug = req.params.slug
  const tour = await Tour.findOne({slug}).populate({
    path: 'reviews',
    fields: 'review rating user'
  })

  console.log(tour);

  res.status(200).render('tour', {
    title: tour.name,
    tour: tour
  })
})
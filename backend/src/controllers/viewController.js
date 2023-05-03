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

  res.status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    ) 
    .render('tour', {
      title: tour.name,
      tour: tour
    })
})

exports.getLoginForm = asyncHandler(async (req, res, next) => {
  res.render('login', {
    title: 'Login to your account'
  })
})

exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.locals.user = undefined
  const tours = await Tour.find({})

  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours
  })
})
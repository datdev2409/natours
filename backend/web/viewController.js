const tourService = require('../api/tours/tourService');

exports.getOverview = async (req, res) => {
  const tours = await tourService.getAllTours();

  res.render('overview', {
    title: 'All Tours',
    tours,
  });
};

exports.getTourDetail = async (req, res) => {
  const { slug } = req.params;
  const tour = await tourService.getTourBySlug(slug);

  res.render('tour', {
    title: tour.name,
    tour,
  });
};

exports.getLoginPage = async (req, res) => {
  res.render('login');
};

exports.signOut = async (req, res) => {
  res.locals.isLogout = true;
  this.getOverview(req, res);
};

const reviewRoutes = require('./reviewRoutes');
const reviewService = require('./reviewService');

module.exports = {
  routes: reviewRoutes,
  service: reviewService,
};

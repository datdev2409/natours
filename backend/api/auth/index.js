const authRoutes = require('./authRoutes');
const authService = require('./authService');
const authMiddleware = require('./authMiddleware');

module.exports = {
  routes: authRoutes,
  service: authService,
  middleware: authMiddleware,
};

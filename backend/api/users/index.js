const userRoutes = require('./userRoutes');
const userService = require('./userService');
const userMiddleware = require('./userMiddleware');

module.exports = {
  routes: userRoutes,
  service: userService,
  middleware: userMiddleware,
};

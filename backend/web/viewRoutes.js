const router = require('express').Router();
const viewController = require('./viewController');

router.get('/', viewController.getOverview);

module.exports = router;

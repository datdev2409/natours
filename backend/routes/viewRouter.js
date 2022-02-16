const router = require('express').Router()
const viewController = require('../controllers/viewController')

// Routes
router.get('/', viewController.getOverview)
router.get('/tour', viewController.getTour)


module.exports = router
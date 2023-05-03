const User = require('../models/userModel')
const factory = require('../controllers/factoryController')

class UserController {
	getMe = (req, res, next) => {
		req.params.id = req.user.id
		console.log('User id: ', req.user.id);
		next()
	}

	getUser = factory.getOne(User, 'reviews')
	getAllUsers = factory.getAll(User)
	updateUser = factory.updateOne(User)
	deleteUser = factory.deleteOne(User)
}

module.exports = new UserController()

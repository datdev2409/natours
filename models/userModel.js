// name, email(unique), password, password_confirmation
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: [8, 'Name must have at least 8 characters'],
		maxlength: [25, 'Name must have at most 25 characters']
	},
	email: {
		type: String,
		lowercase: true,
		trim: true,
		unique: true,
		required: true,
		validate: [validator.isEmail, 'Email validation failed']
	},
	password: {
		type: String,
		trim: true,
		required: true,
		minlength: [8, 'Password must have at least 8 characters'],
		maxlength: [25, 'Password must have at most 25 characters']
	},
	password_confirmation: {
		type: String,
		trim: true,
		required: true,
		validate: {
			validator: function (password_confirmation) {
				return password_confirmation === this.password;
			},
			message: 'The password confirmation does not match'
		}
	}
});

userSchema.pre('save', async function () {
	this.password = await bcrypt.hash(this.password, 12);
	this.password_confirmation = undefined;
});

const User = mongoose.model('User', userSchema);
module.exports = User;

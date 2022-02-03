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
		maxlength: [25, 'Password must have at most 25 characters'],
		select: false
	},
	passwordConfirm: {
		type: String,
		trim: true,
		required: true,
		validate: {
			validator: function (confirm) {
				return confirm === this.password;
			},
			message: 'The password confirmation does not match'
		}
	},
	passwordChangedAt: {
		type: Date
	}
});

userSchema.pre('save', async function (next) {
	// Only encrypt password, if password is actually modified
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

// userSchema.post('updateOne', async function (next) {
// 	const user = User.find(this);
// 	console.log(user);
// 	// if (this.isModified('password')) {
// 	// 	this.passwordChangedAt = Date.now();
// 	// }
// 	next();
// });

userSchema.methods.verifyPassword = async function (plainPassword, password) {
	return await bcrypt.compare(plainPassword, password);
};

userSchema.methods.isPasswordChangeAfter = async function (JWTTimestamp) {
	if (!this.passwordChangedAt) return false;
	return Date.parse(this.passwordChangedAt) / 1000 >= JWTTimestamp;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

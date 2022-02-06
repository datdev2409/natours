// name, email(unique), password, password_confirmation
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
	photo: String,
	role: {
		type: String,
		enum: ['user', 'admin', 'guide', 'lead-guide'],
		default: 'user'
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
			// this only defined when use save and create (not update)
			validator: function (confirm) {
				return confirm === this.password;
			},
			message: 'The password confirmation does not match'
		}
	},
	passwordChangedAt: {
		type: Date
	},
	passwordResetToken: String,
	passwordResetExpires: Date
});

userSchema.pre('save', async function (next) {
	// Only encrypt password, if password is actually modified
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 12);
		this.passwordConfirm = undefined;
		this.passwordChangedAt = Date.now() - 1000;
	}
	next();
});

userSchema.pre('updateOne', async function (next) {
	// This is query object ( not document object )
	const password = this.getUpdate()['password'];
	if (password) {
		this.set({ passwordChangedAt: new Date(), password: 'hello' });
	}
	next();
});

userSchema.methods.verifyPassword = async function (plainPassword, password) {
	password = password || this.password;
	return await bcrypt.compare(plainPassword, password);
};

userSchema.methods.isPasswordChangeAfter = function (JWTTimestamp) {
	if (!this.passwordChangedAt) return false;
	return Date.parse(this.passwordChangedAt) / 1000 >= JWTTimestamp;
};

userSchema.methods.createRandomResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

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
    maxlength: [25, 'Name must have at most 25 characters'],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true,
    // validate: [validator.isEmail, 'Email validation failed']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: [8, 'Password must have at least 8 characters'],
    maxlength: [25, 'Password must have at most 25 characters'],
    select: false,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  loginAttempts: {
    type: Number,
    default: 10,
    select: false,
  },
  lockUntil: Date,
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Virtual properties
userSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'user',
  localField: '_id',
});

// User Middleware
userSchema.pre(/^find/, function (next) {
  this.find({ active: true }).select('-passwordChangedAt -__v -id');
  next();
});

userSchema.pre('save', async function (next) {
  // Only encrypt password, if password is actually modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

// METHODS
userSchema.methods.verifyPassword = async function (plainPassword) {
  const password = this.password ? this.password : '1';
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

userSchema.methods.wrongPassword = async function () {
  if (this.loginAttempts === 1) {
    return this.constructor.findByIdAndUpdate(this.id, {
      lockUntil: Date.now() + 60 * 1000,
      loginAttempts: 10,
    });
  }
  await this.constructor.findByIdAndUpdate(this.id, {
    loginAttempts: this.loginAttempts - 1,
  });
};

userSchema.methods.rightPassword = async function () {
  await User.findByIdAndUpdate(this.id, {
    loginAttempts: 10,
  });
};

const User = mongoose.model('User', userSchema);
module.exports = User;

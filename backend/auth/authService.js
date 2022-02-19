const User = require('../users/userModel');
const base = require('../utils/baseService');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const generateToken = (id) => {
  const privateKey = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const token = jwt.sign({ id }, privateKey, { expiresIn });
  return token;
};

exports.register = async (body) => {
  const user = await base.createOne(User)(body);
  user.token = generateToken(user.id);
  return user;
};

const decodeToken = (token) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

exports.login = async (body) => {
  const { email, password } = body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new AppError('User is not exists', 403);
  if (!(await user.verifyPassword(password))) {
    throw new AppError("Password doesn't not match", 403);
  }

  user.token = generateToken(user.id);
  return user;
};

exports.protect = async (body, cookies) => {
  const bodyToken = body.token || 'Bearer';
  const token = bodyToken.split(' ')[1] || cookies.token;

  if (!token) throw new AppError('No token found', 403);

  const { id } = await decodeToken(token);
  const user = User.findById(id);

  return user;
};

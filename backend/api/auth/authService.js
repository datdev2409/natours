const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../users/userModel');
const base = require('../../utils/baseService');
// const sendEmail = require('../utils/email');

const generateToken = (id) => {
  const privateKey = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const token = jwt.sign({ id }, privateKey, { expiresIn });
  return token;
};

const getUserByEmail = (email) => User.findOne({ email });

const decodeToken = (token) => {
  const { JWT_SECRET } = process.env;
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

exports.register = async (body) => {
  const exists = await getUserByEmail(body.email);
  if (exists) throw createError(404, 'User aldready exists');

  const user = await base.createOne(User)(body);
  user.token = generateToken(user.id);
  return user;
};

exports.login = async (body) => {
  const { email, password } = body;
  const user = await getUserByEmail(email).select('+password');

  if (!user) throw createError(403, 'User is not exists');
  if (!(await user.verifyPassword(password))) {
    throw createError(403, "Password doesn't not match");
  }

  user.token = generateToken(user.id);
  return user;
};

exports.protect = async (body, cookies) => {
  const bodyToken = body.token || 'Bearer';
  const token = bodyToken.split(' ')[1] || cookies.token;

  if (!token) throw createError(403, 'No token found');

  const { id } = await decodeToken(token);
  const user = User.findById(id);

  return user;
};

const jwt = require('jsonwebtoken');
const AppError = require('../../utils/appError');
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

const getToken = (body, cookies) => {
  const bodyToken = body.token || 'Bearer';
  const token = bodyToken.split(' ')[1] || cookies.token;

  if (!token) throw new AppError(403, 'No token found');
  return token;
};

const verifyPassword = async (user, password) => {
  if (!(await user.verifyPassword(password))) {
    throw new AppError(403, "Password doesn't not match");
  }
};

const getUserWithToken = (user) => {
  const token = generateToken(user.id);
  return Object.assign(user, { token });
};

const getUser = async (query) => {
  const user = await User.findOne(query).select('+password');
  if (!user) throw new AppError(403, 'User does not exists');
  return user;
};

const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new AppError('403', "Password doesn't not match");
  }
};

exports.register = async (body) => {
  const exists = await getUserByEmail(body.email);
  if (exists) throw new AppError(404, 'User aldready exists');

  const user = await base.createOne(User)(body);

  return getUserWithToken(user);
};

exports.login = async (body) => {
  const { email, password } = body;
  const user = await getUser({ email });

  await verifyPassword(user, password);

  return getUserWithToken(user);
};

exports.protect = async (body, cookies) => {
  const token = getToken(body, cookies);
  const { id, iat } = await decodeToken(token);

  const user = await User.findById(id);
  if (!user) throw Error('Authentication failed');

  if (user.isPasswordChanged(iat)) {
    throw new AppError(404, 'Password changed. Login again!!');
  }

  return user;
};

exports.updatePassword = async (currentUser, body) => {
  const { password, newPassword, confirmPassword } = body;

  const user = await getUser({ email: currentUser.email });

  await verifyPassword(user, password);
  validateConfirmPassword(newPassword, confirmPassword);

  user.password = newPassword;
  await user.save();
  return user;
};

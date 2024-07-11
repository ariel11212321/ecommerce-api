const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const user = new User({ name, email, password });
  await user.save();
  return { message: 'User registered successfully' };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  const token = jwt.sign({ _id: user._id }, 'your_jwt_secret');
  return { token };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};

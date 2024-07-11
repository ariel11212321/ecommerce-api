const userService = require('../services/userService');
const { createClient } = require('redis');
const redisClient = createClient();
redisClient.connect().catch(console.error);

const registerUser = async (req, res) => {
  try {
    const response = await userService.registerUser(req.body);
    res.status(201).send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await userService.loginUser(email, password);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    redisClient.setEx(req.params.id, 600, JSON.stringify(user)); // Cache for 10 minutes
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};

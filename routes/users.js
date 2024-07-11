const express = require('express');
const userController = require('../controllers/userController');
const { createClient } = require('redis');

const router = express.Router();
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Middleware for caching
const cache = (req, res, next) => {
  const { id } = req.params;
  redisClient.get(id, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};

// Register User
router.post('/register', userController.registerUser);

// Login User
router.post('/login', userController.loginUser);

// Add a route to get user by ID with caching
router.get('/:id', cache, userController.getUserById);

module.exports = router;

const express = require('express');
const orderController = require('../controllers/orderController');
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

// Create Order
router.post('/', orderController.createOrder);

// Get All Orders for a User
router.get('/user/:userId', orderController.getOrdersByUserId);

// Get Order by ID with caching
router.get('/:id', cache, orderController.getOrderById);

// Update Order Status
router.put('/:id', orderController.updateOrderStatus);

module.exports = router;

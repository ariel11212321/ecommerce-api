const orderService = require('../services/orderService');
const { createClient } = require('redis');
const redisClient = createClient();
redisClient.connect().catch(console.error);

const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUserId(req.params.userId);
    res.send(orders);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }
    redisClient.setEx(req.params.id, 600, JSON.stringify(order)); // Cache for 10 minutes
    res.send(order);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body);
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }
    redisClient.del(req.params.id); // Remove from cache
    res.send(order);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
};

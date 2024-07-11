const Order = require('../models/Order');

const createOrder = async (orderData) => {
  const order = new Order(orderData);
  await order.save();
  return order;
};

const getOrdersByUserId = async (userId) => {
  const orders = await Order.find({ user: userId });
  return orders;
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId).populate('products.product');
  return order;
};

const updateOrderStatus = async (orderId, statusData) => {
  const order = await Order.findByIdAndUpdate(orderId, statusData, { new: true, runValidators: true });
  return order;
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
};

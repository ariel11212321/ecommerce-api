const productService = require('../services/productService');
const { createClient } = require('redis');
const redisClient = createClient();
redisClient.connect().catch(console.error);

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.send(products);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    redisClient.setEx(req.params.id, 600, JSON.stringify(product)); // Cache for 10 minutes
    res.send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    redisClient.del(req.params.id); // Remove from cache
    res.send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    redisClient.del(req.params.id); // Remove from cache
    res.send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

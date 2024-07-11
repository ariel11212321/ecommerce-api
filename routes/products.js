const express = require('express');
const productController = require('../controllers/productController');
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

// Create Product
router.post('/', productController.createProduct);

// Get All Products
router.get('/', productController.getAllProducts);

// Get Product by ID with caching
router.get('/:id', cache, productController.getProductById);

// Update Product
router.put('/:id', productController.updateProduct);

// Delete Product
router.delete('/:id', productController.deleteProduct);

module.exports = router;

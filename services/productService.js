const Product = require('../models/Product');

const createProduct = async (productData) => {
  const product = new Product(productData);
  await product.save();
  return product;
};

const getAllProducts = async () => {
  const products = await Product.find({});
  return products;
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId);
  return product;
};

const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
  return product;
};

const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  return product;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

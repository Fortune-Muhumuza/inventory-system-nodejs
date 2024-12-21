'use strict';

const dateFormat = require('dateformat');
const Product = require('../models/product.model');
const Sell = require('../models/sellTransactions');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger'); // Custom logger for monitoring

// Helper function for error handling
const handleError = (res, message, redirectUrl = '/') => {
  logger.error(message);
  res.render('error', { error: message });
};

// Test route
exports.test = (req, res) => {
  res.render('index', { name: req.session.user.businessName });
};

// Add a new product to the inventory
exports.product_buy = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('error', { error: 'Invalid input data' });
  }

  try {
    const product = new Product({
      userId: req.session.user._id,
      name: req.body.name.toLowerCase(),
      sellingPrice: req.body.sellingPrice,
      quantity: req.body.quantity,
      permanentQuantityBought: req.body.quantity,
      cumulativeQuantity: req.body.quantity,
      buyingValue: ((+req.body.buyingPrice + (+req.body.tax / +req.body.quantity)) * +req.body.quantity),
      tax: req.body.tax,
      buyingPrice: req.body.buyingPrice,
      profit: +req.body.sellingPrice - (+req.body.buyingPrice + +req.body.tax / +req.body.quantity),
      date: dateFormat(new Date(), 'dddd-mmmm-dS-yyyy, h:MM TT'),
    });

    await product.save();
    res.redirect('/');
  } catch (err) {
    handleError(res, 'There was an error while adding the product.');
  }
};

// Render sell page
exports.product_sell = (req, res) => {
  res.render('sell', { page_name: 'sell', name: req.session.user.businessName });
};

// Sell a product
exports.product_sell1 = async (req, res) => {
  try {
    const oldProduct = await Product.findOne({ name: req.body.name.toLowerCase() });

    if (!oldProduct) {
      return res.render('error', { error: 'Product not found in inventory' });
    }

    if (oldProduct.quantity <= 0) {
      return res.render('error', { error: 'Sorry, this item is out of stock' });
    }

    if (req.body.quantity > oldProduct.quantity) {
      return res.render('error', {
        error: 'Not enough stock to complete the sale. Please enter a lower quantity.',
      });
    }

    // Update product quantity
    await Product.findOneAndUpdate(
      { name: oldProduct.name },
      { quantity: oldProduct.quantity - req.body.quantity }
    );

    const sell = new Sell({
      userId: req.session.user._id,
      name: req.body.name.toLowerCase(),
      quantity: req.body.quantity,
      permanentQuantitySold: req.body.quantity,
      sellingPrice: oldProduct.sellingPrice,
      paid: oldProduct.sellingPrice * req.body.quantity,
      profit: oldProduct.profit * req.body.quantity,
      date: dateFormat(new Date(), 'dddd-mmmm-dS-yyyy, h:MM TT'),
    });

    await sell.save();
    res.redirect('/sellTransactions');
  } catch (err) {
    handleError(res, 'There was an error during the sale process.');
  }
};

// Display all transactions
exports.displayTransactions = async (req, res) => {
  try {
    const sells = await Sell.find({ userId: req.session.user._id });
    const products = await Product.find({ userId: req.session.user._id });
    res.render('sellTransactions', {
      title: 'Transactions',
      sell: sells,
      product: products,
      name: req.session.user.businessName,
    });
  } catch (err) {
    handleError(res, 'There was an error fetching transactions.');
  }
};

// Display transactions in JSON format
exports.displayTransactionsJSON = async (req, res) => {
  try {
    const sells = await Sell.find({ userId: req.session.user._id }).select('name quantity -_id');
    res.json(sells);
  } catch (err) {
    handleError(res, 'Error fetching transactions as JSON.');
  }
};

// Get store graph data for visualization
exports.displayStoreGraphData = async (req, res) => {
  try {
    const products = await Product.find({}).select('name quantity -_id');
    res.json(products);
  } catch (err) {
    handleError(res, 'Error fetching store graph data.');
  }
};

// Display all products in inventory
exports.product_display = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.session.user._id });
    res.render('home', { title: 'Store', product: products, name: req.session.user.businessName });
  } catch (err) {
    handleError(res, 'Sorry, there was a problem retrieving the products.');
  }
};

// Display a single product
exports.displaySingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('singleProduct', { product });
  } catch (err) {
    handleError(res, 'Error displaying the product details.');
  }
};

// Get permanent records for all products
exports.getPermanentRecords = async (req, res) => {
  try {
    const product = await Product.find({ userId: req.session.user._id }).select('name permanentQuantityBought -_id');
    res.json(product);
  } catch (err) {
    handleError(res, 'Error fetching permanent records.');
  }
};

// Delete a store record
exports.deleteStoreRecord = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    handleError(res, 'Error deleting store record.');
  }
};

// Display a single sale record
exports.displaySingleSaleRecord = async (req, res) => {
  try {
    const sell = await Sell.findById(req.params.id);
    res.render('singleSaleRecord', { sell });
  } catch (err) {
    handleError(res, 'Error displaying the sale record.');
  }
};

// Delete a sale record
exports.deleteSaleRecord = async (req, res) => {
  try {
    await Sell.findByIdAndDelete(req.params.id);
    res.redirect('/sellTransactions');
  } catch (err) {
    handleError(res, 'Error deleting the sale record.');
  }
};

// Render QR code page for adding product
exports.getAddWithQrCode = (req, res) => {
  res.render('qrSell');
};

// Add product via QR code (currently empty)
exports.addWithQrCode = (req, res) => {
  // Implement QR code logic here
};

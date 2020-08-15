/* eslint-disable space-before-function-paren */
'use strict';
const Product = require('../models/product.model');
const Sell = require('../models/sellTransactions');

// Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.render('index');
};

exports.product_buy = async function (req, res) {
  // THE STANDARD SELLING PRICE WITH PROFIT INCLUDED

  let product = new Product({
    name: req.body.name,
    sellingPrice: req.body.sellingPrice,
    quantity: req.body.quantity,
    cumulativeQuantity: req.body.quantity,
    buyingValue: (+req.body.buyingPrice + +req.body.tax) * +req.body.quantity,
    tax: req.body.tax,
    buyingPrice: req.body.buyingPrice,
    profit: +req.body.sellingPrice - (+req.body.buyingPrice + +req.body.tax),
    date: new Date(),
  });
  /* this is for the cumulative quantity ..THIS IS VERY IMPORTANT AND SHOULD BE
   TREATED AS A
  CRITICAL ISSUE BECAUE WHEN THIS PART IS RUN, WITHOUT FIXING THIS ISSUE,
  IT ALSO REDUCES THE
  QUANTITY ON THE HISTORY TRANSACTION WHICH ISNT GOOD
*/

  product.save(function (err) {
    if (err) {
      res.send('there was an error');
      // return next(err);
    }
    res.redirect('/');
  });
};

exports.product_sell = (req, res) => {
  res.render('sell');
};

exports.product_sell1 = async (req, res) => {
  // remember to only change the variable quantity not the quantity bought
  const oldProduct = await Product.findOne({ name: req.body.name });
  // eslint-disable-next-line no-unused-vars
  const product = await Product.findOneAndUpdate(
    { name: oldProduct.name },
    { quantity: oldProduct.quantity - req.body.quantity },
  );

  let sell = new Sell({
    name: req.body.name,
    quantity: req.body.quantity,
    sellingPrice: oldProduct.sellingPrice,
    paid: +oldProduct.sellingPrice * +req.body.quantity,
    profit: +oldProduct.profit * +req.body.quantity,
    date: new Date(),
  });
  // INCASE OF ERRORS WE NEED TO FIND A WAY OF NOT CRUSHING SERVER
  sell.save(function (err) {
    if (err) {
      res.send('sorry there was a problem');
    }
    res.redirect('/sellTransactions');
  });
};

// display the previous transactions
exports.displayTransactions = (req, res) => {
  Sell.find(function (err, sell) {
    Product.find(function (err, product) {
      res.render('sellTransactions', {
        sell: sell,
        product: product,
      });
    });
  });
};

exports.product_display = (req, res) => {
  Product.find()
    .then((product) => {
      res.render('home', { title: 'Listing registrations', product });
    })
    .catch(() => {
      res.send('Sorry! Something went wrong.');
    });
};


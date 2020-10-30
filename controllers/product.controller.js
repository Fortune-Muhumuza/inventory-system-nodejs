/* eslint-disable space-before-function-paren */
'use strict';
const dateFormat = require('dateformat');
const Product = require('../models/product.model');
const Sell = require('../models/sellTransactions');

// Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.render('index');
};

exports.product_buy = async function (req, res) {
  // In a future version maybe ill add option for first
  // querying the DB to see if the product exists already
  // if it does ill just increase its amount

 

  let product = new Product({
    name: req.body.name.toLowerCase(),
    //decided to use lower case instead
    sellingPrice: req.body.sellingPrice,
    quantity: req.body.quantity,
    permanentQuantityBought: req.body.quantity,
    cumulativeQuantity: req.body.quantity,
    buyingValue: (+req.body.buyingPrice + +req.body.tax) * +req.body.quantity,
    tax: req.body.tax,
    buyingPrice: req.body.buyingPrice,
    profit:
      +req.body.sellingPrice -
      (+req.body.buyingPrice + +req.body.tax / +req.body.quantity),
    date: dateFormat(new Date(), 'dddd-mmmm-dS-yyyy, h:MM TT'),
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
  res.render('sell', { page_name: 'sell' });
};

exports.product_sell1 = async (req, res) => {
  const oldProduct = await Product.findOne({
    name: req.body.name.toLowerCase(),
  });

  // this checks if there are still shoes of that brand or model in stock and does the needful

  if (oldProduct.quantity <= 0) {
    res.render('error', { error: 'Sorry, this shoe is out of stock' });
  }
  if (req.body.quantity > oldProduct.quantity) {
    res.render('error', {
      error:
        'Sorry, the quantity of shoes in stock is less than the quantity you are trying to sell, please enter a lower quantity',
    });
  } else {
    // remember to only change the variable quantity not the quantity bought
    const product = await Product.findOneAndUpdate(
      { name: oldProduct.name },
      { quantity: oldProduct.quantity - req.body.quantity }
    );

    //there is need for functionality that returns a statement of shoe not in stock when user tries to sell a shoe that is not in store

    let sell = new Sell({
      name: req.body.name.toLowerCase(),
      quantity: req.body.quantity,
      permanentQuantitySold: req.body.quantity,
      sellingPrice: oldProduct.sellingPrice,
      paid: +oldProduct.sellingPrice * +req.body.quantity,
      profit: +oldProduct.profit * +req.body.quantity,
      date: dateFormat(new Date(), 'dddd-mmmm-dS-yyyy, h:MM TT'),
    });
    // INCASE OF ERRORS WE NEED TO FIND A WAY OF NOT CRUSHING SERVER
    sell.save(function (err) {
      if (err) {
        res.send('sorry there was a problem');
      }
      res.redirect('/sellTransactions');
    });
  }
};

// display the previous transactions
exports.displayTransactions = (req, res) => {
  Sell.find(function (err, sell) {
    Product.find(function (err, product) {
      res.render('sellTransactions', {
        title: 'Transactions',
        sell: sell,
        product: product,
      });
    });
  });
};

exports.displayTransactionsJSON = async(req, res) => {
  //select helps to filter out specific data
  const sells = await Sell.find({}).select('name quantity -_id')
  res.json(sells)
  
  // Sell.find(function (err, sell) {
  //   Product.find(function (err, product) {
  //     return res.json({ sell });
  //   });
  // });
};

exports.product_display = async (req, res) => {
  const product = await Product.find();
  if (product) {
    res.render('home', { title: 'Store', product });
  } else {
    res.render('error', {
      error:
        'Sorry, there was a problem retrieving the products from the store database',
    });
  }
};

exports.displaySingleProduct = async(req, res) => {
  const product = await Product.findById(req.params.id)
  //.select('name _id')

  //console.log(product)
  res.render('singleProduct', {product: product})
}

//cumulative quantity already catered  for this but this is also fine
exports.getPermanentRecords = async(req, res) => {
  const product = await Product.find({}).select('name permanentQuantityBought -_id')
  res.json(product)
}

exports.deleteStoreRecord = async(req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  res.redirect('/')
}

exports.displaySingleSaleRecord = async(req, res) => {
  const sell = await Sell.findById(req.params.id)
  res.render('singleSaleRecord', {sell: sell})
}

exports.deleteSaleRecord =async(req, res) => {
  const sell = await Sell.findByIdAndDelete(req.params.id)
  res.redirect('/sellTransactions')
}

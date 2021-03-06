/* eslint-disable space-before-function-paren */
'use strict';
const dateFormat = require('dateformat');
const Product = require('../models/product.model');
const Sell = require('../models/sellTransactions');

// Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.render('index', {name: req.session.user.businessName});
};

exports.product_buy = async function (req, res) {
  // In a future version maybe ill add option for first
  // querying the DB to see if the product exists already
  // if it does ill just increase it's amount

 

  let product = new Product({
    userId: req.session.user._id,
    name: req.body.name.toLowerCase(),
    //decided to use lower case instead
    sellingPrice: req.body.sellingPrice,
    quantity: req.body.quantity,
    permanentQuantityBought: req.body.quantity,
    cumulativeQuantity: req.body.quantity,
    buyingValue: ((+req.body.buyingPrice) + (+req.body.tax / +req.body.quantity)) * +req.body.quantity,
    tax: req.body.tax,
    buyingPrice: req.body.buyingPrice,
    profit:
      +req.body.sellingPrice -
      (+req.body.buyingPrice + +req.body.tax / +req.body.quantity),
    date: dateFormat(new Date(), 'dddd-mmmm-dS-yyyy, h:MM TT'),
  });
  /* this is for cumulative quantity ..THIS IS VERY IMPORTANT AND SHOULD BE
   TREATED AS A
  CRITICAL ISSUE BECAUE WHEN THIS PART IS RUN, WITHOUT FIXING THIS ISSUE,
  IT ALSO REDUCES THE
  QUANTITY ON THE HISTORY TRANSACTION WHICH ISNT GOOD
*/

  product.save(function (err) {
    if (err) {
      res.send('there was an error');
      
    }
    res.redirect('/');
  });
};

exports.product_sell = (req, res) => {
  res.render('sell', { page_name: 'sell', name: req.session.user.businessName});
};

exports.product_sell1 = async (req, res) => {
  const oldProduct = await Product.findOne({
    name: req.body.name.toLowerCase(),
  });

  // this checks if there are still items of that brand or model in stock and does the needful

  if (oldProduct.quantity <= 0) {
    res.render('error', { error: 'Sorry, this item is out of stock' });
  }
  if (req.body.quantity > oldProduct.quantity) {
    res.render('error', {
      error:
        'Sorry, the quantity of the item in stock is less than the quantity you are trying to sell, please enter a lower quantity',
    });
  } else {
    // remember to only change the variable quantity not the quantity bought
    const product = await Product.findOneAndUpdate(
      { name: oldProduct.name },
      { quantity: oldProduct.quantity - req.body.quantity }
    );

    //there is need for functionality that returns a statement of item not in stock when user tries to sell an item that is not in store

    let sell = new Sell({
      userId: req.session.user._id,
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
exports.displayTransactions = async(req, res) => {
  const sell = await Sell.find({userId: req.session.user._id})
  const product = await Product.find({userId: req.session.user._id})
      res.render('sellTransactions', {
        title: 'Transactions',
        sell: sell,
        product: product,
        name: req.session.user.businessName
      });
};

exports.displayTransactionsJSON = async(req, res) => {
  //select helps to filter out specific data
  const sells = await Sell.find({userId: req.session.user._id}).select('name quantity -_id')
  res.json(sells)
  
};

//get data for generating the store graph
exports.displayStoreGraphData = async(req, res) => {
  const products = await Product.find({}).select('name quantity -_id')
  res.json(products)
}

exports.product_display = async (req, res) => {
  const product = await Product.find({userId: req.session.user._id});
  if (product) {
    res.render('home', { title: 'Store', product, name: req.session.user.businessName });
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
  const product = await Product.find({userId: req.session.user._id}).select('name permanentQuantityBought -_id')
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

exports.getAddWithQrCode = async(req, res) => {
  res.render('qrSell')
}

exports.addWithQrCode = async(req, res) => {

}
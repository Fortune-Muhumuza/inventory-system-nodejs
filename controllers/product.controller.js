const Product = require("../models/product.model");
const Sell = require("../models/sellTransactions");

//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.render("index");
};

exports.product_buy = async function (req, res) {
  //THE STANDARD SELLING PRICE WITH PROFIT INCLUDED

  let product = new Product({
    name: req.body.name,
    sellingPrice: req.body.sellingPrice,
    quantity: req.body.quantity,
    cumulativeQuantity: req.body.quantity,
    buyingValue: (+req.body.buyingPrice + +req.body.tax) * +req.body.quantity,
    tax: req.body.tax,
    //costPerItem: req.body.buyingPrice,
    buyingPrice: req.body.buyingPrice,
    profit: +req.body.sellingPrice - (+req.body.buyingPrice + +req.body.tax),
    date: new Date()
  });
  /*this is for the cumulative quantity ..THIS IS VERY IMPORTANT AND SHOULD BE
   TREATED AS A 
  CRITICAL ISSUE BECAUE WHEN THIS PART IS RUN, WITHOUT FIXING THIS ISSUE, 
  IT ALSO REDUCES THE 
  QUANTITY ON THE HISTORY TRANSACTION WHICH ISNT GOOD
*/
  /*
  const oldProdct = await Product.findOne({ name: req.body.name });
  const prodct = await Product.findOneAndUpdate(
    { name: oldProdct.name },
    { cumulativeQuantity: +oldProdct.cumulativeQuantity + +req.body.quantity }
  );

  console.log(prodct.cumulativeQuantity);
*/
  product.save(function (err) {
    if (err) {
      res.send("there was an error");
      //return next(err);
    }
    res.redirect("/products/");
  });
};

exports.product_sell = (req, res) => {
  res.render("sell");
};

exports.product_details = function (req, res) {
  Product.findById(req.params.id, function (err, product) {
    if (err) return next(err);
    res.send(product);
  });
};

exports.product_sell1 = async (req, res) => {

  //remember to only change the variable quantity not the quantity bought
  const oldProduct = await Product.findOne({ name: req.body.name });
  const product = await Product.findOneAndUpdate(
    { name: oldProduct.name },
    { quantity: oldProduct.quantity - req.body.quantity }
  );
  // product.quantity -= req.body.quantity
  // await product.save()
  //console.log("the product is", product);

  let sell = new Sell({
    name: req.body.name,
    quantity: req.body.quantity,
    sellingPrice: oldProduct.sellingPrice,
    paid: +oldProduct.sellingPrice * +req.body.quantity,
    profit: +oldProduct.profit * +req.body.quantity,
    date: new Date()
  });
//INCASE OF ERRORS WE NEED TO FIND A WAY OF NOT CRUSHING SERVER
  sell.save(function (err) {
    if (err) {
      res.send("sorry there was a problem");
    }
    res.redirect("/products/sellTransactions");
  });
};

//display the previous transactions
exports.displayTransactions = (req, res) => {
  Sell.find(function (err, sell) {
    Product.find(function (err, product) {
      res.render("sellTransactions", {
        sell: sell,
        product: product,
      });
    });
  });
  /* Sell.find()
    .then((sell) => {
      res.render("sellTransactions", {
        title: "Listing registrations",
        sell: sell,
      });
    })
    .catch(() => {
      res.send("Sorry! Something went wrong.");
    });
  Product.find()
    .then((product) => {
      res.render("sellTransactions", { prodct: product });
    })
    .catch(() => {
      res.send("Sorry! Something went wrong.");
    });
    */
};

exports.product_update1 = function (req, res) {
  let prdct = {};
  prdct.quantity = req.body.quantity; //this totally changes everything

  let query = { _id: req.params.id };

  Product.update(query, prdct, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Article Updated");
      res.redirect("/");
    }
  });
};

exports.product_display = (req, res) => {
  Product.find()
    .then((product) => {
      res.render("home", { title: "Listing registrations", product });
    })
    .catch(() => {
      res.send("Sorry! Something went wrong.");
    });
};

exports.product_delete = function (req, res) {
  Product.findByIdAndRemove(req.params.id, function (err) {
    if (err) return next(err);
    res.send("Deleted successfully!");
  });
};

// Access Control
ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/users/login");
  }
};

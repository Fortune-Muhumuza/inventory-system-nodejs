const Product = require("../models/product.model");
const Sell = require("../models/sellTransactions");

//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.render("index");
};

exports.product_buy = function (req, res) {
  let product = new Product({
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    value: +req.body.price * +req.body.quantity,
    tax: req.body.tax,
    sellingPrice: +req.body.price + +req.body.tax,
  });

  product.save(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/products/');
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
  let sell = new Sell({
    name: req.body.name,
    quantity: req.body.quantity,
    sellingPrice: req.body.sellingPrice,
    paid: +req.body.sellingPrice * +req.body.quantity,
  });

  const oldProduct = await Product.findOne({ name: req.body.name });
  const product = await Product.findOneAndUpdate(
    { name: oldProduct.name },
    { quantity: oldProduct.quantity - req.body.quantity }
  );
  // product.quantity -= req.body.quantity
  // await product.save()
  console.log("the product is", product);

  sell.save(function (err) {
   /* if (err) {
      res.send("sorry there was a problem");
    }*/
    res.redirect('/products/sellTransactions');
  });
};

//display the previous transactions
exports.displayTransactions = (req, res) => {
  Sell.find()
    .then((sell) => {
      res.render("sellTransactions", { title: "Listing registrations", sell });
    })
    .catch(() => {
      res.send("Sorry! Something went wrong.");
    });
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

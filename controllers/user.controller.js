const User = require('../models/User');
const bcrypt = require('bcrypt');
const session = require('express-session');

exports.signup = (req, res) => {
  res.render('signup');
};

exports.login = (req, res) => {
  res.render('login');
};

exports.postSignup = async (req, res) => {
  const formName = req.body.name.toUpperCase();

  const checkUser = await User.findOne({ name: formName }).exec();
  //console.log(checkUser);

  if (checkUser) {
    res.render('error', {
      error: 'Sorry, that name is already taken',
    });
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name.toUpperCase(),
      password: hashedPassword,
      businessName: req.body.businessName,
    });
    const savedUser = await user.save();
    //console.log(savedUser);
    res.redirect('/user/login');
  }
};

exports.postLogin = async (req, res) => {
  let { password } = req.body;
  let name = req.body.name.toUpperCase();

  // 1) Check if email and password exist
  if (!name || !password) {
    res.render('error', { error: 'PLease enter name and password' });
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ name }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    res.render('error', { error: 'wrong name or password' });
  }

  req.session.user = user;
  //console.log(req.session.user)
  res.redirect('/');
};

exports.logout = (req, res) => {
  req.session.destroy(function (err) {
    // cannot access session here
  });
  res.redirect('/user/login');
};

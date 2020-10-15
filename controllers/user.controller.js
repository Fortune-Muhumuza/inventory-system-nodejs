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
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      password: hashedPassword,
    });
    user.save();
    res.redirect('/user/login');
  } catch {
    res.redirect('/signup');
  }
};

exports.postLogin = async (req, res) => {
  let { name, password } = req.body;
  if (!name || !password) res.json('please provide name and password', 400);
  const user = await User.findOne({ name });
  

  if (
    !(req.body.name === user.name) ||
    !(req.body.password === user.password)
  ) {
    res.json('wrong details');
  }

req.session.userId = user._id

//console.log(req.session)
  res.redirect('/');
};

'use strict';
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.loginPage = (req, res) => {
  res.render('login');
};

exports.registerPage = (req, res) => {
  res.render('register');
};

// Register Proccess
exports.register = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  {
    let newUser = new User({
      username: username,
      password: password,
    });

    bcrypt.genSalt(10, function(_err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err) {
          if (err) {
            console.log(err);
            return;
          } else {
            console.log('success', 'You are now registered and can log in');
            res.redirect('/login');
          }
        });
      });
    });
  }
};

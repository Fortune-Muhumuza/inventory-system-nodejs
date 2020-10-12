'use strict';
const mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var SALT_FACTOR = 10;

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.methods.name = function() {
  return this.displayName || this.username;
}

var noop = function() {};

UserSchema.pre('save', function(done) {
  var user = this;
  if(!user.isModified('password')) {
      return done();
  }
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      if(err) { 
          return done(err) 
      }
      bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
          if(err) {
              return done(err);
          }
          user.password = hashedPassword;
          done();
      });
  });
});

UserSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
      done(err, isMatch);
  });
}

// eslint-disable-next-line no-unused-vars
const User = (module.exports = mongoose.model('User', UserSchema));

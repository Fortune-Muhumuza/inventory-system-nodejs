'use strict';
const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// eslint-disable-next-line no-unused-vars
const User = (module.exports = mongoose.model('User', UserSchema));

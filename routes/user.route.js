'use strict';
const express = require('express');
const router = express.Router();


const user_controller = require('../controllers/user.controller');


router.get('/signup', user_controller.signup);
router.get('/login', user_controller.login);

//router.post('/signup', user_controller.postSignup);
//router.post('/login', user_controller.postLogin);

module.exports = router;

'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const setUpPassport = require('./setuppassport');

// Imports routes for the products
const product = require('./routes/product.route');
const user = require('./routes/user.route');
// initialize our express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

setUpPassport();

app.use('/', product);
app.use('/user/', user)

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const uri =
  // eslint-disable-next-line max-len
  'mongodb+srv://Fort:fortune@cluster0.144qe.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Please wait while I connect to the database');
  })

  .then(() => {
    console.log('MongoDB Connected…');
  })

  .catch((err) => console.log(err));

// start the server listening for requests
app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));

// app.listen(port, () => {
//   console.log('Server is up and running on port numner ' + port);
// });

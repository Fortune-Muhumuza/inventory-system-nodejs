'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
//const morgan = require('morgan');

// Imports routes for the products
const product = require('./routes/product.route');
const user = require('./routes/user.route');
const admin = require('./routes/admin.route');
// initialize our express app
const app = express();

//app.use(morgan('combined'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  //res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(
  session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
    cookie: {
      //this is 15 hours
      maxAge: 5.4e7,
      sameSite: true,
      // secure: true
    },
  })
);

app.use('/', product);
app.use('/user/', user);
app.use('/area51/admin/', admin);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const uri = 'mongodb://localhost:27017/invsystem';
//'mongodb+srv://Fort:fortune@cluster0.144qe.mongodb.net/KhanShoeCenter?retryWrites=true&w=majority';
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })

  .then(() => {
    console.log('Database Connected');
  })

  .catch((err) => console.log(err));


// start the server listening for requests
app.listen(process.env.PORT || 3000, () =>
  console.log(`The program is running`)
);

// app.listen(port, () => {
//   console.log('Server is up and running on port numner ' + port);
// });

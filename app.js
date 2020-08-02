const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');



const product = require('./routes/product.route'); // Imports routes for the products
const user = require('./routes/userRoute');
// initialize our express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use('/products', product);
app.use('/', user);



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


const uri = "mongodb+srv://Fort:fortune@cluster0.144qe.mongodb.net/<dbname>?retryWrites=true&w=majority"
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected…')
})

.catch(err => console.log(err))
 

let port = 3000;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
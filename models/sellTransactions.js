const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SellTransaction = new Schema({
    name: {type: String, required: true, max: 100},
    quantity: {type: Number, required: true},
    sellingPrice:{type: Number, required: true},
    paid:{type: Number, required: true},
});


// Export the model
module.exports = mongoose.model('Sell', SellTransaction);
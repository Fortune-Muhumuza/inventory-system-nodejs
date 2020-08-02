const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    name: {type: String, required: true, max: 100},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    value:{type: Number, required: true},
    tax:{type: Number, required: true},
    sellingPrice:{type: Number, required: true}
});


// Export the model
module.exports = mongoose.model('Product', ProductSchema);
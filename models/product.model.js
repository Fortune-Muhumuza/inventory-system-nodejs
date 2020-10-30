'use strict';
const mongoose = require('mongoose');
const { schema } = require('./sellTransactions');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  quantity: { type: Number, required: true },
  cumulativeQuantity: { type: Number, required: true },
  permanentQuantityBought: { type: Number, required: true },
  buyingValue: { type: Number, required: true },
  tax: { type: Number, required: true },
  buyingPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  profit: { type: Number, required: true },
  date: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Export the model
module.exports = mongoose.model('Product', ProductSchema);

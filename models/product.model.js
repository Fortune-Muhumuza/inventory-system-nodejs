'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      maxlength: [100, 'Product name must not exceed 100 characters'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    cumulativeQuantity: {
      type: Number,
      required: true,
      min: [0, 'Cumulative quantity cannot be negative'],
    },
    permanentQuantityBought: {
      type: Number,
      required: true,
      min: [0, 'Permanent quantity bought cannot be negative'],
    },
    buyingValue: {
      type: Number,
      required: true,
      min: [0, 'Buying value cannot be negative'],
    },
    tax: {
      type: Number,
      required: true,
      min: [0, 'Tax cannot be negative'],
      default: 0,
    },
    buyingPrice: {
      type: Number,
      required: true,
      min: [0, 'Buying price cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: [0, 'Selling price cannot be negative'],
    },
    profit: {
      type: Number,
      required: true,
      min: [0, 'Profit cannot be negative'],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Add indexes
ProductSchema.index({ userId: 1, name: 1 }, { unique: true }); // Prevent duplicate products for the same user
ProductSchema.index({ date: -1 }); // Optimize queries for recent products

// Export the model
module.exports = mongoose.model('Product', ProductSchema);

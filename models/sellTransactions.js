'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SellTransactionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Transaction name is required'],
      maxlength: [100, 'Transaction name must not exceed 100 characters'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    permanentQuantitySold: {
      type: Number,
      required: true,
      min: [0, 'Permanent quantity sold cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
    },
    paid: {
      type: Number,
      required: [true, 'Paid amount is required'],
      min: [0, 'Paid amount cannot be negative'],
    },
    profit: {
      type: Number,
      required: [true, 'Profit is required'],
      min: [0, 'Profit cannot be negative'],
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit', 'Debit', 'Online'],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
      default: function() {
        return this.sellingPrice * this.quantity;
      },
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
SellTransactionSchema.index({ userId: 1, date: -1 }); // Index to optimize sales lookup by user and date
SellTransactionSchema.index({ status: 1 }); // Index for quick lookup of transaction status

// Export the model
module.exports = mongoose.model('SellTransaction', SellTransactionSchema);

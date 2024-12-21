'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let InventorySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    currentStock: {
      type: Number,
      required: true,
      min: [0, 'Current stock cannot be negative'],
    },
    restockThreshold: {
      type: Number,
      required: true,
      min: [0, 'Restock threshold cannot be negative'],
    },
    lastRestockDate: {
      type: Date,
      default: Date.now,
    },
    totalSold: {
      type: Number,
      default: 0,
      min: [0, 'Total sold cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Add index on productId for faster lookup
InventorySchema.index({ productId: 1 });

// Export the model
module.exports = mongoose.model('Inventory', InventorySchema);

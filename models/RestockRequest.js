'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RestockRequestSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    requestedQuantity: {
      type: Number,
      required: true,
      min: [0, 'Requested quantity cannot be negative'],
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for fast lookup
RestockRequestSchema.index({ productId: 1, status: 1 });

// Export the model
module.exports = mongoose.model('RestockRequest', RestockRequestSchema);

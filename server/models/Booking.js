const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ resource: 1, startAt: 1, endAt: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
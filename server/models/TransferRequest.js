const mongoose = require('mongoose');

const transferRequestSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
    },
    fromDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    toDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    reason: {
      type: String,
      default: '',
      trim: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    decisionAt: {
      type: Date,
      default: null,
    },
    transferDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

transferRequestSchema.index({ asset: 1, status: 1 });

module.exports = mongoose.model('TransferRequest', transferRequestSchema);
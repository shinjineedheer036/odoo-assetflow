const mongoose = require('mongoose');

const auditRecordSchema = new mongoose.Schema(
  {
    auditCycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuditCycle',
      required: true,
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
    },
    auditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    expectedLocation: {
      type: String,
      default: '',
      trim: true,
    },
    foundLocation: {
      type: String,
      default: '',
      trim: true,
    },
    condition: {
      type: String,
      enum: ['new', 'good', 'fair', 'poor', 'damaged', 'unknown'],
      default: 'unknown',
    },
    status: {
      type: String,
      enum: ['matched', 'missing', 'damaged', 'unknown'],
      default: 'unknown',
    },
    remarks: {
      type: String,
      default: '',
      trim: true,
    },
    auditedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

auditRecordSchema.index({ auditCycle: 1, asset: 1 }, { unique: true });

module.exports = mongoose.model('AuditRecord', auditRecordSchema);
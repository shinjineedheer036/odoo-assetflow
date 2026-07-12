const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    actorUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actorEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
    },
    entityId: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
      trim: true,
    },
    userAgent: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
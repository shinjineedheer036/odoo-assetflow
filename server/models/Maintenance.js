const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    type: {
      type: String,
      enum: ['preventive', 'corrective', 'emergency'],
      default: 'corrective',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'on_hold', 'resolved', 'closed'],
      default: 'open',
    },
    issueDescription: {
      type: String,
      required: true,
      trim: true,
    },
    resolutionNotes: {
      type: String,
      default: '',
      trim: true,
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
    nextServiceDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

maintenanceSchema.index({ asset: 1, status: 1 });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
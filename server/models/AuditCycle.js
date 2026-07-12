const mongoose = require('mongoose');

const auditCycleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    scope: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['planned', 'in_progress', 'completed', 'archived'],
      default: 'planned',
    },
    createdBy: {
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

auditCycleSchema.index({ status: 1, startDate: 1 });

module.exports = mongoose.model('AuditCycle', auditCycleSchema);
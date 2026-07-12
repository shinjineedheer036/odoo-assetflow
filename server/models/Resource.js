const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['room', 'equipment', 'software', 'document', 'other'],
      default: 'other',
    },
    category: {
      type: String,
      default: '',
      trim: true,
    },
    url: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    accessLevel: {
      type: String,
      enum: ['public', 'internal', 'restricted'],
      default: 'internal',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resource', resourceSchema);
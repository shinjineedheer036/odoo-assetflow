const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    assetTag: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssetCategory',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    serialNumber: {
      type: String,
      default: '',
      trim: true,
      unique: true,
      sparse: true,
    },
    model: {
      type: String,
      default: '',
      trim: true,
    },
    brand: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['available', 'allocated', 'maintenance', 'retired', 'lost'],
      default: 'available',
    },
    condition: {
      type: String,
      enum: ['new', 'good', 'fair', 'poor'],
      default: 'good',
    },
    purchaseDate: {
      type: Date,
      default: null,
    },
    purchasePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    warrantyEndDate: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    currentEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    currentDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    assignedAt: {
      type: Date,
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

assetSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Asset', assetSchema);
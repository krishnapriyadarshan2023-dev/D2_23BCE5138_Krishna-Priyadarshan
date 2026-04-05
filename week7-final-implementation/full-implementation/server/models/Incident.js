const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['theft', 'harassment', 'fire', 'medical', 'accident', 'violence', 'suspicious', 'other'],
    required: [true, 'Category is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: String
  },
  severity: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'dispatched', 'resolved'],
    default: 'pending'
  },
  mediaUrls: [String],
  aiClassification: {
    category: String,
    confidence: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for location queries
incidentSchema.index({ location: '2dsphere' });

// Update timestamp on save
incidentSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Incident', incidentSchema);

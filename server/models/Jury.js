const mongoose = require('mongoose');

const jurySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  hasSubmitted: {
    type: Boolean,
    default: false
  },
  paused: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Jury', jurySchema);
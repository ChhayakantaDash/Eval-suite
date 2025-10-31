const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  juryName: { type: String, required: true, trim: true },
  teamName: { type: String, required: true, trim: true },
  criteria: {
    type: Map,      // Allows dynamic keys (any criteria)
    of: Number,     // Each value is a number
    default: {}     // Start empty
  },
  total: { type: Number, required: true }
}, { timestamps: true });

// Prevent duplicate marks from same jury for same team
marksSchema.index({ juryName: 1, teamName: 1 }, { unique: true });

module.exports = mongoose.model('Marks', marksSchema);

const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  policyName: String,
  insurerName: String,
  hospitalTieUp: Boolean,
  ageMin: Number,
  ageMax: Number,
  diseases: [String],
  roomType: String,
  amountCap: Number,
  coverageLimit: Number,
  validityStart: Date,
  validityEnd: Date
});

module.exports = mongoose.model('Policy', policySchema);

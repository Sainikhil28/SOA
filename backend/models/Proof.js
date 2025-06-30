const mongoose = require('mongoose');

const proofSchema = new mongoose.Schema({
  proofId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  }
});

const Proof = mongoose.model('Proof', proofSchema); // Use singular 'Proof'

module.exports = Proof;

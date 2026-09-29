const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: { type: String, required: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  designation: { type: String, required: true },
  phone: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  isVerified: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);

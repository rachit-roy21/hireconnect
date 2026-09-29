const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    unique: true
  },
  logo: { type: String, default: '' },
  website: { type: String, default: '' },
  description: { type: String, default: '' },
  industry: { type: String, default: 'Technology' },
  location: { type: String, default: '' },
  size: { type: String, default: '50-200' },
  isVerified: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);

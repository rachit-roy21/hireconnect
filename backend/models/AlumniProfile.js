const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentCompany: { type: String, required: true },
  currentDesignation: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  department: { type: String, required: true },
  industry: { type: String, default: 'Technology' },
  location: { type: String, default: '' },
  skills: [{ type: String }],
  bio: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  isAvailableForMentorship: { type: Boolean, default: true },
  isAvailableForReferrals: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);

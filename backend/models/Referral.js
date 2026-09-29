const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  alumni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: [true, 'Target company is required']
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title or role is required']
  },
  message: {
    type: String,
    required: [true, 'Referral message is required']
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  responseNote: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

referralSchema.index({ student: 1, alumni: 1, company: 1, status: 1 });
referralSchema.index({ alumni: 1, createdAt: -1 });
referralSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('Referral', referralSchema);

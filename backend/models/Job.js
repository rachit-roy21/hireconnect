const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  employmentType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract'],
    default: 'Full-Time'
  },
  experienceRequired: {
    type: String,
    default: '0-1 years'
  },
  salary: {
    type: String,
    default: 'Not Disclosed'
  },
  skills: [{
    type: String
  }],
  eligibility: {
    type: String,
    default: 'B.Tech / B.E. / M.Tech / MCA'
  },
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },
  applicantsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ companyName: 1 });
jobSchema.index({ title: 'text', description: 'text', companyName: 'text' });
jobSchema.index({ postedBy: 1 });

module.exports = mongoose.model('Job', jobSchema);

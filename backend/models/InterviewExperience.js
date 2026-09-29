const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundName: { type: String, required: true },
  description: { type: String, required: true }
});

const interviewExperienceSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  role: {
    type: String,
    required: [true, 'Role title is required']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  outcome: {
    type: String,
    enum: ['Selected', 'Rejected', 'Pending'],
    default: 'Selected'
  },
  rounds: [roundSchema],
  questions: [{ type: String }],
  experienceText: {
    type: String,
    required: [true, 'Experience details are required']
  },
  advice: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Rejected'],
    default: 'Approved'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InterviewExperience', interviewExperienceSchema);

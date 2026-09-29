const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  workLifeBalance: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },
  workEnvironment: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },
  careerGrowth: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },
  learningOpportunities: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },
  interviewExperience: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Rejected'],
    default: 'Approved'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);

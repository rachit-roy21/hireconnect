const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const Referral = require('../models/Referral');
const Review = require('../models/Review');
const InterviewExperience = require('../models/InterviewExperience');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const recruiterCount = await User.countDocuments({ role: 'recruiter' });
    const alumniCount = await User.countDocuments({ role: 'alumni' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'Open' });
    const totalApplications = await Application.countDocuments();

    const selectedApplications = await Application.countDocuments({ status: 'Selected' });
    const pendingReferrals = await Referral.countDocuments({ status: 'Pending' });
    const totalCompanies = await Company.countDocuments();

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('student', 'name email')
      .populate('job', 'title companyName');

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        studentCount,
        recruiterCount,
        alumniCount,
        adminCount,
        totalJobs,
        openJobs,
        totalApplications,
        selectedApplications,
        pendingReferrals,
        totalCompanies
      },
      recentUsers,
      recentApplications
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsersList = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Admin cannot deactivate their own account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.getCompaniesList = async (req, res, next) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: companies.length, companies });
  } catch (error) {
    next(error);
  }
};

exports.createCompany = async (req, res, next) => {
  try {
    const { name, logo, website, description, industry, location, size } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    const company = await Company.create({
      name,
      logo: logo || '',
      website: website || '',
      description: description || '',
      industry: industry || 'Technology',
      location: location || '',
      size: size || '50-200',
      isVerified: true,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

exports.moderateReview = async (req, res, next) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.status = status || 'Approved';
    await review.save();

    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

exports.moderateInterview = async (req, res, next) => {
  try {
    const { status } = req.body;
    const experience = await InterviewExperience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Interview experience record not found' });
    }

    experience.status = status || 'Approved';
    await experience.save();

    res.status(200).json({ success: true, experience });
  } catch (error) {
    next(error);
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate('postedBy', 'name email');
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .populate('student', 'name email')
      .populate('job', 'title companyName');
    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).populate('author', 'name email');
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

exports.getInterviews = async (req, res, next) => {
  try {
    const experiences = await InterviewExperience.find().sort({ createdAt: -1 }).populate('author', 'name email');
    res.status(200).json({ success: true, count: experiences.length, experiences });
  } catch (error) {
    next(error);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.status(200).json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    await company.deleteOne();
    res.status(200).json({ success: true, message: 'Company removed' });
  } catch (error) {
    next(error);
  }
};

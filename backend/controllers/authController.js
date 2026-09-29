const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const AlumniProfile = require('../models/AlumniProfile');
const Company = require('../models/Company');
const { sendTokenResponse } = require('../utils/token');

const loadProfile = async (user) => {
  if (user.role === 'student') {
    return StudentProfile.findOne({ user: user._id });
  }
  if (user.role === 'recruiter') {
    return RecruiterProfile.findOne({ user: user._id }).populate('companyId');
  }
  if (user.role === 'alumni') {
    return AlumniProfile.findOne({ user: user._id });
  }
  return null;
};

exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      companyName,
      designation,
      graduationYear,
      department,
      currentCompany
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email address is already registered' });
    }

    const allowedRoles = ['student', 'recruiter', 'alumni'];
    const userRole = allowedRoles.includes(role) ? role : 'student';

    if (userRole === 'recruiter' && !companyName) {
      return res.status(400).json({ success: false, message: 'Company name is required for recruiters' });
    }

    if (userRole === 'alumni' && (!currentCompany || !graduationYear || !department)) {
      return res.status(400).json({
        success: false,
        message: 'Current company, graduation year, and department are required for alumni'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });

    if (userRole === 'student') {
      await StudentProfile.create({ user: user._id });
    } else if (userRole === 'recruiter') {
      let company = await Company.findOne({ name: companyName.trim() });
      if (!company) {
        company = await Company.create({
          name: companyName.trim(),
          createdBy: user._id
        });
      }
      await RecruiterProfile.create({
        user: user._id,
        companyName: company.name,
        companyId: company._id,
        designation: designation || 'Talent Acquisition'
      });
    } else if (userRole === 'alumni') {
      await AlumniProfile.create({
        user: user._id,
        currentCompany,
        currentDesignation: designation || 'Software Engineer',
        graduationYear,
        department
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact admin.' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = await loadProfile(user);

    res.status(200).json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

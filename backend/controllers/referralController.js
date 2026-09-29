const Referral = require('../models/Referral');
const AlumniProfile = require('../models/AlumniProfile');
const StudentProfile = require('../models/StudentProfile');
const { createNotification } = require('../utils/notify');

exports.requestReferral = async (req, res, next) => {
  try {
    const { alumniId, company, jobTitle, message, resumeUrl } = req.body;

    if (!alumniId || !company || !jobTitle || !message) {
      return res.status(400).json({ success: false, message: 'Alumni, company, job title, and message are required' });
    }

    const alumniProfile = await AlumniProfile.findById(alumniId).populate('user');
    if (!alumniProfile) {
      return res.status(404).json({ success: false, message: 'Alumni profile not found' });
    }

    if (!alumniProfile.isAvailableForReferrals) {
      return res.status(400).json({ success: false, message: 'This alumnus is currently not accepting referral requests' });
    }

    const existingPending = await Referral.findOne({
      student: req.user.id,
      alumni: alumniProfile.user._id,
      company,
      status: { $in: ['Pending', 'Accepted'] }
    });

    if (existingPending) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active referral request for this company with this alumnus'
      });
    }

    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    const resume = resumeUrl || (studentProfile ? studentProfile.resumeUrl : '');

    const referral = await Referral.create({
      student: req.user.id,
      alumni: alumniProfile.user._id,
      company,
      jobTitle,
      message,
      resumeUrl: resume,
      status: 'Pending'
    });

    await createNotification({
      recipient: alumniProfile.user._id,
      title: 'New Referral Request',
      message: `${req.user.name} requested a referral for ${jobTitle} at ${company}`,
      type: 'referral',
      link: '/alumni/referrals'
    });

    res.status(201).json({ success: true, referral });
  } catch (error) {
    next(error);
  }
};

exports.getStudentReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .populate('alumni', 'name email avatar');

    res.status(200).json({ success: true, count: referrals.length, referrals });
  } catch (error) {
    next(error);
  }
};

exports.getAlumniReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find({ alumni: req.user.id })
      .sort({ createdAt: -1 })
      .populate('student', 'name email avatar');

    const detailed = await Promise.all(referrals.map(async (ref) => {
      const studentProfile = await StudentProfile.findOne({ user: ref.student?._id });
      return { ...ref.toObject(), studentProfile };
    }));

    res.status(200).json({ success: true, count: detailed.length, referrals: detailed });
  } catch (error) {
    next(error);
  }
};

exports.updateReferralStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, responseNote } = req.body;

    const allowed = ['Pending', 'Accepted', 'Rejected', 'Completed'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid referral status' });
    }

    const referral = await Referral.findById(id);
    if (!referral) {
      return res.status(404).json({ success: false, message: 'Referral request not found' });
    }

    if (referral.alumni.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this referral' });
    }

    if (status) referral.status = status;
    if (responseNote !== undefined) referral.responseNote = responseNote;
    await referral.save();

    await createNotification({
      recipient: referral.student,
      title: 'Referral Status Update',
      message: `Your referral request for ${referral.company} has been updated to "${referral.status}".`,
      type: 'referral',
      link: '/student/referrals'
    });

    res.status(200).json({ success: true, referral });
  } catch (error) {
    next(error);
  }
};

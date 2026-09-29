const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const { createNotification } = require('../utils/notify');

exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job id is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'This job listing is closed' });
    }

    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({ success: false, message: 'The application deadline has passed' });
    }

    const existingApp = await Application.findOne({ student: req.user.id, job: jobId });
    if (existingApp) {
      return res.status(409).json({ success: false, message: 'You have already applied for this job' });
    }

    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    const resumeUrl = resume || studentProfile?.resumeUrl || '';

    const application = await Application.create({
      student: req.user.id,
      job: jobId,
      resume: resumeUrl,
      coverLetter: coverLetter || '',
      status: 'Applied'
    });

    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    await createNotification({
      recipient: job.postedBy,
      title: 'New Job Application',
      message: `${req.user.name} applied for ${job.title}`,
      type: 'application',
      link: `/recruiter/jobs/${job._id}/applicants`
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

exports.getStudentApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location' }
      });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

exports.getJobApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ job: jobId })
      .sort({ createdAt: -1 })
      .populate('student', 'name email avatar');

    const detailedApplicants = await Promise.all(applications.map(async (app) => {
      const profile = await StudentProfile.findOne({ user: app.student._id });
      return {
        ...app.toObject(),
        studentProfile: profile
      };
    }));

    res.status(200).json({ success: true, count: detailedApplicants.length, job, applications: detailedApplicants });
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, recruiterNotes } = req.body;

    const allowed = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status' });
    }

    const application = await Application.findById(id).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    if (status) application.status = status;
    if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes;
    await application.save();

    await createNotification({
      recipient: application.student,
      title: 'Application Status Update',
      message: `Your application status for ${application.job.title} has been updated to "${application.status}".`,
      type: 'application',
      link: '/student/applications'
    });

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

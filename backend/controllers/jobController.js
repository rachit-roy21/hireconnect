const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');
const Application = require('../models/Application');
const RecruiterProfile = require('../models/RecruiterProfile');
const Company = require('../models/Company');
const { createNotification } = require('../utils/notify');

exports.getJobs = async (req, res, next) => {
  try {
    const {
      search,
      company,
      employmentType,
      location,
      status,
      sort = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'Open';
    }

    if (company) {
      query.companyName = { $regex: company, $options: 'i' };
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'deadline') sortObj = { deadline: 1 };
    if (sort === 'title') sortObj = { title: 1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [total, jobs] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('company', 'name logo website industry location')
        .populate('postedBy', 'name email')
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name logo website industry location description')
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    let saved = false;
    if (req.user && req.user.role === 'student') {
      const existing = await SavedJob.findOne({ student: req.user.id, job: job._id });
      saved = Boolean(existing);
    }

    res.status(200).json({ success: true, job, saved });
  } catch (error) {
    next(error);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const {
      title,
      companyName,
      description,
      location,
      employmentType,
      experienceRequired,
      salary,
      skills,
      eligibility,
      deadline
    } = req.body;

    if (!title || !description || !location || !deadline) {
      return res.status(400).json({ success: false, message: 'Please provide all required job fields' });
    }

    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user.id });
    const resolvedCompanyName = companyName || recruiterProfile?.companyName;

    if (!resolvedCompanyName) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    let company = recruiterProfile?.companyId
      ? await Company.findById(recruiterProfile.companyId)
      : await Company.findOne({ name: resolvedCompanyName });

    if (!company) {
      company = await Company.create({
        name: resolvedCompanyName,
        createdBy: req.user.id
      });
    }

    const job = await Job.create({
      title,
      company: company._id,
      companyName: company.name,
      description,
      location,
      employmentType: employmentType || 'Full-Time',
      experienceRequired: experienceRequired || '0-1 years',
      salary: salary || 'Not Disclosed',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : []),
      eligibility: eligibility || 'B.Tech / B.E. / M.Tech / MCA',
      deadline,
      postedBy: req.user.id
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    const updates = { ...req.body };
    if (updates.skills && typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    delete updates.postedBy;
    delete updates.applicantsCount;

    job = await Job.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    await Application.deleteMany({ job: req.params.id });
    await SavedJob.deleteMany({ job: req.params.id });

    res.status(200).json({ success: true, message: 'Job removed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.toggleSaveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const existing = await SavedJob.findOne({ student: req.user.id, job: job._id });
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ success: true, saved: false, message: 'Job removed from saved list' });
    }

    await SavedJob.create({ student: req.user.id, job: job._id });
    res.status(201).json({ success: true, saved: true, message: 'Job saved successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location' }
      });

    const jobs = saved.map((item) => item.job).filter(Boolean);

    res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecruiterJobs = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { postedBy: req.user.id };
    const jobs = await Job.find(query).sort({ createdAt: -1 }).populate('company', 'name logo');

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

exports.closeJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to close this job' });
    }

    job.status = job.status === 'Open' ? 'Closed' : 'Open';
    await job.save();

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

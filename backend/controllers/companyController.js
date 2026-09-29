const Company = require('../models/Company');
const Job = require('../models/Job');
const Review = require('../models/Review');

exports.getCompanies = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const companies = await Company.find(query).sort({ createdAt: -1 });

    const withCounts = await Promise.all(companies.map(async (company) => {
      const jobs = await Job.countDocuments({ companyName: company.name, status: 'Open' });
      const reviews = await Review.find({ companyName: company.name, status: 'Approved' });
      const avg = reviews.length
        ? reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length
        : 0;
      return {
        ...company.toObject(),
        openJobs: jobs,
        reviewCount: reviews.length,
        averageRating: Math.round(avg * 10) / 10
      };
    }));

    res.status(200).json({ success: true, count: withCounts.length, companies: withCounts });
  } catch (error) {
    next(error);
  }
};

exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const jobs = await Job.find({ companyName: company.name, status: 'Open' }).sort({ createdAt: -1 });
    const reviews = await Review.find({ companyName: company.name, status: 'Approved' }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, company, jobs, reviews });
  } catch (error) {
    next(error);
  }
};

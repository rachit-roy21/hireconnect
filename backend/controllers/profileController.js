const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const AlumniProfile = require('../models/AlumniProfile');
const User = require('../models/User');
const Company = require('../models/Company');

exports.updateStudentProfile = async (req, res, next) => {
  try {
    const {
      phone,
      headline,
      bio,
      location,
      skills,
      education,
      experience,
      projects,
      certifications,
      resumeUrl,
      githubUrl,
      linkedinUrl,
      portfolioUrl
    } = req.body;

    let profile = await StudentProfile.findOne({ user: req.user.id });

    if (!profile) {
      profile = new StudentProfile({ user: req.user.id });
    }

    if (phone !== undefined) profile.phone = phone;
    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (skills !== undefined) profile.skills = skills;
    if (education !== undefined) profile.education = education;
    if (experience !== undefined) profile.experience = experience;
    if (projects !== undefined) profile.projects = projects;
    if (certifications !== undefined) profile.certifications = certifications;
    if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
    if (githubUrl !== undefined) profile.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) profile.portfolioUrl = portfolioUrl;

    await profile.save();

    if (req.body.name) {
      await User.findByIdAndUpdate(req.user.id, { name: req.body.name });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

exports.updateRecruiterProfile = async (req, res, next) => {
  try {
    const { companyName, designation, phone, linkedinUrl, website, description, industry, location, size, logo } = req.body;

    let profile = await RecruiterProfile.findOne({ user: req.user.id });

    if (!profile) {
      if (!companyName || !designation) {
        return res.status(400).json({ success: false, message: 'Company name and designation are required' });
      }
      profile = new RecruiterProfile({ user: req.user.id, companyName, designation });
    }

    if (companyName !== undefined) profile.companyName = companyName;
    if (designation !== undefined) profile.designation = designation;
    if (phone !== undefined) profile.phone = phone;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;

    if (companyName) {
      let company = profile.companyId ? await Company.findById(profile.companyId) : await Company.findOne({ name: companyName });
      if (!company) {
        company = await Company.create({
          name: companyName,
          createdBy: req.user.id
        });
      }
      if (website !== undefined) company.website = website;
      if (description !== undefined) company.description = description;
      if (industry !== undefined) company.industry = industry;
      if (location !== undefined) company.location = location;
      if (size !== undefined) company.size = size;
      if (logo !== undefined) company.logo = logo;
      if (companyName) company.name = companyName;
      await company.save();
      profile.companyId = company._id;
    }

    await profile.save();

    if (req.body.name) {
      await User.findByIdAndUpdate(req.user.id, { name: req.body.name });
    }

    const populated = await RecruiterProfile.findById(profile._id).populate('companyId');
    res.status(200).json({ success: true, profile: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateAlumniProfile = async (req, res, next) => {
  try {
    const {
      currentCompany,
      currentDesignation,
      graduationYear,
      department,
      industry,
      location,
      skills,
      bio,
      linkedinUrl,
      isAvailableForMentorship,
      isAvailableForReferrals
    } = req.body;

    let profile = await AlumniProfile.findOne({ user: req.user.id });

    if (!profile) {
      if (!currentCompany || !currentDesignation || !graduationYear || !department) {
        return res.status(400).json({ success: false, message: 'Company, designation, graduation year, and department are required' });
      }
      profile = new AlumniProfile({
        user: req.user.id,
        currentCompany,
        currentDesignation,
        graduationYear,
        department
      });
    }

    if (currentCompany !== undefined) profile.currentCompany = currentCompany;
    if (currentDesignation !== undefined) profile.currentDesignation = currentDesignation;
    if (graduationYear !== undefined) profile.graduationYear = graduationYear;
    if (department !== undefined) profile.department = department;
    if (industry !== undefined) profile.industry = industry;
    if (location !== undefined) profile.location = location;
    if (skills !== undefined) profile.skills = skills;
    if (bio !== undefined) profile.bio = bio;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (isAvailableForMentorship !== undefined) profile.isAvailableForMentorship = isAvailableForMentorship;
    if (isAvailableForReferrals !== undefined) profile.isAvailableForReferrals = isAvailableForReferrals;

    await profile.save();

    if (req.body.name) {
      await User.findByIdAndUpdate(req.user.id, { name: req.body.name });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

exports.getAlumniList = async (req, res, next) => {
  try {
    const { search, company, skills, department, industry, designation } = req.query;
    const query = {};

    if (company) {
      query.currentCompany = { $regex: company, $options: 'i' };
    }
    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }
    if (industry) {
      query.industry = { $regex: industry, $options: 'i' };
    }
    if (designation) {
      query.currentDesignation = { $regex: designation, $options: 'i' };
    }
    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      query.skills = { $in: skillsArray.map((s) => new RegExp(s, 'i')) };
    }

    let alumniProfiles = await AlumniProfile.find(query).populate('user', 'name email avatar role isActive');
    alumniProfiles = alumniProfiles.filter((alumnus) => alumnus.user && alumnus.user.isActive);

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      alumniProfiles = alumniProfiles.filter((alumnus) => (
        alumnus.currentCompany.match(searchRegex) ||
        alumnus.currentDesignation.match(searchRegex) ||
        (alumnus.user && alumnus.user.name.match(searchRegex)) ||
        alumnus.department.match(searchRegex) ||
        (alumnus.industry && alumnus.industry.match(searchRegex)) ||
        (alumnus.skills || []).some((s) => searchRegex.test(s))
      ));
    }

    res.status(200).json({ success: true, count: alumniProfiles.length, alumni: alumniProfiles });
  } catch (error) {
    next(error);
  }
};

exports.getAlumniById = async (req, res, next) => {
  try {
    const alumnus = await AlumniProfile.findById(req.params.id).populate('user', 'name email avatar role');

    if (!alumnus) {
      return res.status(404).json({ success: false, message: 'Alumni profile not found' });
    }

    res.status(200).json({ success: true, alumnus });
  } catch (error) {
    next(error);
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    if (req.user.role === 'student' && req.user.id !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this student profile' });
    }

    const student = await StudentProfile.findOne({ user: req.params.userId }).populate('user', 'name email avatar role');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

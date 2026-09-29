const InterviewExperience = require('../models/InterviewExperience');

exports.getInterviewExperiences = async (req, res, next) => {
  try {
    const { companyName, role, difficulty, search } = req.query;
    const query = { status: 'Approved' };

    if (companyName) {
      query.companyName = { $regex: companyName, $options: 'i' };
    }

    if (role) {
      query.role = { $regex: role, $options: 'i' };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { experienceText: { $regex: search, $options: 'i' } },
        { questions: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const experiences = await InterviewExperience.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar role');

    res.status(200).json({ success: true, count: experiences.length, experiences });
  } catch (error) {
    next(error);
  }
};

exports.getInterviewExperienceById = async (req, res, next) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id)
      .populate('author', 'name avatar role');

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Interview experience not found' });
    }

    res.status(200).json({ success: true, experience });
  } catch (error) {
    next(error);
  }
};

exports.createInterviewExperience = async (req, res, next) => {
  try {
    const { companyName, role, difficulty, outcome, rounds, questions, experienceText, advice } = req.body;

    if (!companyName || !role || !experienceText) {
      return res.status(400).json({ success: false, message: 'Company name, role, and details are required' });
    }

    const formattedQuestions = Array.isArray(questions)
      ? questions
      : (questions ? questions.split('\n').filter(Boolean) : []);

    const experience = await InterviewExperience.create({
      author: req.user.id,
      companyName,
      role,
      difficulty: difficulty || 'Medium',
      outcome: outcome || 'Selected',
      rounds: rounds || [],
      questions: formattedQuestions,
      experienceText,
      advice: advice || '',
      status: 'Approved'
    });

    res.status(201).json({ success: true, experience });
  } catch (error) {
    next(error);
  }
};

exports.deleteInterviewExperience = async (req, res, next) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Interview experience not found' });
    }

    if (experience.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this experience' });
    }

    await experience.deleteOne();
    res.status(200).json({ success: true, message: 'Interview experience removed' });
  } catch (error) {
    next(error);
  }
};

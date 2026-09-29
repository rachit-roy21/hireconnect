const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');

const skillMatch = (studentSkills, requiredSkills) => {
  const normalizedStudent = studentSkills.map((s) => s.toLowerCase().trim());
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((skill) => {
    const normalized = skill.toLowerCase().trim();
    if (normalizedStudent.some((st) => st.includes(normalized) || normalized.includes(st))) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const totalRequired = requiredSkills.length || 1;
  const matchPercentage = Math.min(100, Math.round((matchedSkills.length / totalRequired) * 100));

  return { matchedSkills, missingSkills, matchPercentage };
};

exports.chatWithAI = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        configured: false,
        message: 'AI assistant is not configured. Set OPENAI_API_KEY in the backend environment.'
      });
    }

    const profile = await StudentProfile.findOne({ user: req.user.id });
    const context = profile
      ? `Student skills: ${(profile.skills || []).join(', ')}. Headline: ${profile.headline || 'N/A'}.`
      : 'No student profile on file.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are HireConnect AI, an expert campus career coach. Help with career paths, skill recommendations, interview preparation, resume suggestions, learning roadmaps, and job preparation. Be concise and practical.'
          },
          { role: 'user', content: `${context}\n\nQuestion: ${prompt}` }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok || !data.choices || !data.choices[0]) {
      return res.status(502).json({
        success: false,
        configured: true,
        message: data.error?.message || 'The AI provider could not complete this request.'
      });
    }

    res.status(200).json({
      success: true,
      reply: data.choices[0].message.content,
      provider: 'OpenAI'
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobRecommendations = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    const studentSkills = studentProfile ? studentProfile.skills : [];

    const jobs = await Job.find({ status: 'Open' }).sort({ createdAt: -1 }).limit(50);

    const recommendations = jobs.map((job) => {
      const { matchedSkills, missingSkills, matchPercentage } = skillMatch(studentSkills, job.skills || []);
      return {
        job,
        matchPercentage,
        matchedSkills,
        missingSkills,
        method: 'skill-overlap',
        explanation: `${matchedSkills.length} of ${(job.skills || []).length} required skills match your profile.`
      };
    });

    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      method: 'Transparent skill matching against job requirements',
      recommendations
    });
  } catch (error) {
    next(error);
  }
};

exports.analyzeResume = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found. Complete your profile first.' });
    }

    const scoreItems = [];
    let score = 40;

    if (profile.headline) { score += 10; scoreItems.push('Headline present (+10)'); }
    if (profile.phone) { score += 5; scoreItems.push('Phone number provided (+5)'); }
    if (profile.skills && profile.skills.length >= 3) { score += 15; scoreItems.push('3+ technical skills listed (+15)'); }
    if (profile.education && profile.education.length > 0) { score += 10; scoreItems.push('Education details added (+10)'); }
    if (profile.projects && profile.projects.length > 0) { score += 10; scoreItems.push('Project portfolio included (+10)'); }
    if (profile.resumeUrl) { score += 10; scoreItems.push('Resume document attached (+10)'); }

    const recommendations = [];
    if (!profile.resumeUrl) recommendations.push('Add a resume URL so recruiters can review your CV.');
    if (!profile.githubUrl) recommendations.push('Add a GitHub profile link to highlight project code.');
    if (!profile.projects || profile.projects.length < 2) recommendations.push('Add at least 2 projects with live or GitHub URLs.');
    if (!profile.skills || profile.skills.length < 5) recommendations.push('Expand your technical skills list.');
    if (!profile.experience || profile.experience.length === 0) recommendations.push('Add internships or relevant experience.');

    res.status(200).json({
      success: true,
      score: Math.min(100, score),
      scoreBreakdown: scoreItems,
      recommendations,
      profileSummary: {
        skillsCount: profile.skills ? profile.skills.length : 0,
        projectsCount: profile.projects ? profile.projects.length : 0,
        hasResume: Boolean(profile.resumeUrl)
      }
    });
  } catch (error) {
    next(error);
  }
};

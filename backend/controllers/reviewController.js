const Review = require('../models/Review');

exports.getCompanyReviews = async (req, res, next) => {
  try {
    const { companyName, search } = req.query;
    const query = { status: 'Approved' };

    if (companyName) {
      query.companyName = { $regex: companyName, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { reviewText: { $regex: search, $options: 'i' } }
      ];
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');

    const sanitizedReviews = reviews.map(rev => {
      const obj = rev.toObject();
      if (obj.isAnonymous && obj.author) {
        obj.author = { name: 'Verified Campus User', avatar: '' };
      }
      return obj;
    });

    res.status(200).json({ success: true, count: sanitizedReviews.length, reviews: sanitizedReviews });
  } catch (error) {
    next(error);
  }
};

exports.createCompanyReview = async (req, res, next) => {
  try {
    const {
      companyName,
      overallRating,
      workLifeBalance,
      workEnvironment,
      careerGrowth,
      learningOpportunities,
      interviewExperience,
      reviewText,
      isAnonymous
    } = req.body;

    if (!companyName || !overallRating || !reviewText) {
      return res.status(400).json({ success: false, message: 'Company name, rating, and review text are required' });
    }

    const review = await Review.create({
      author: req.user.id,
      companyName,
      overallRating,
      workLifeBalance: workLifeBalance || 4,
      workEnvironment: workEnvironment || 4,
      careerGrowth: careerGrowth || 4,
      learningOpportunities: learningOpportunities || 4,
      interviewExperience: interviewExperience || 4,
      reviewText,
      isAnonymous: isAnonymous || false,
      status: 'Approved'
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

exports.deleteCompanyReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

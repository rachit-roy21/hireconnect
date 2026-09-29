const express = require('express');
const {
  chatWithAI,
  getJobRecommendations,
  analyzeResume
} = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/chat', protect, chatWithAI);
router.get('/recommendations', protect, authorize('student'), getJobRecommendations);
router.get('/analyze-resume', protect, authorize('student'), analyzeResume);

module.exports = router;

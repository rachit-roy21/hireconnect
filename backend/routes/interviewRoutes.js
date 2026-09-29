const express = require('express');
const {
  getInterviewExperiences,
  getInterviewExperienceById,
  createInterviewExperience,
  deleteInterviewExperience
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getInterviewExperiences);
router.get('/:id', getInterviewExperienceById);
router.post('/', protect, createInterviewExperience);
router.delete('/:id', protect, deleteInterviewExperience);

module.exports = router;

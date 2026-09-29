const express = require('express');
const {
  updateStudentProfile,
  updateRecruiterProfile,
  updateAlumniProfile,
  getAlumniList,
  getAlumniById,
  getStudentById
} = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/alumni', getAlumniList);
router.get('/alumni/:id', getAlumniById);
router.get('/student/:userId', protect, getStudentById);

router.put('/student', protect, authorize('student', 'admin'), updateStudentProfile);
router.put('/recruiter', protect, authorize('recruiter', 'admin'), updateRecruiterProfile);
router.put('/alumni', protect, authorize('alumni', 'admin'), updateAlumniProfile);

module.exports = router;

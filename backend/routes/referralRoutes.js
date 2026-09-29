const express = require('express');
const {
  requestReferral,
  getStudentReferrals,
  getAlumniReferrals,
  updateReferralStatus
} = require('../controllers/referralController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('student'), requestReferral);
router.get('/student', protect, authorize('student'), getStudentReferrals);
router.get('/alumni', protect, authorize('alumni', 'admin'), getAlumniReferrals);
router.put('/:id/status', protect, authorize('alumni', 'admin'), updateReferralStatus);

module.exports = router;

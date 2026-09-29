const express = require('express');
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleSaveJob,
  getSavedJobs,
  getRecruiterJobs,
  closeJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');
const optionalProtect = require('../middleware/optionalAuth');

const router = express.Router();

router.get('/', getJobs);
router.get('/saved', protect, authorize('student'), getSavedJobs);
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.get('/:id', optionalProtect, getJobById);

router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.put('/:id/close', protect, authorize('recruiter', 'admin'), closeJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

router.post('/:id/save', protect, authorize('student'), toggleSaveJob);

module.exports = router;

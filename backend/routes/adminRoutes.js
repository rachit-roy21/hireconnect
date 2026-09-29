const express = require('express');
const {
  getDashboardStats,
  getUsersList,
  toggleUserStatus,
  getCompaniesList,
  createCompany,
  updateCompany,
  deleteCompany,
  moderateReview,
  moderateInterview,
  getJobs,
  getApplications,
  getReviews,
  getInterviews
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsersList);
router.put('/users/:id/toggle-status', toggleUserStatus);

router.get('/companies', getCompaniesList);
router.post('/companies', createCompany);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);

router.get('/jobs', getJobs);
router.get('/applications', getApplications);
router.get('/reviews', getReviews);
router.get('/interviews', getInterviews);

router.put('/reviews/:id/moderate', moderateReview);
router.put('/interviews/:id/moderate', moderateInterview);

module.exports = router;

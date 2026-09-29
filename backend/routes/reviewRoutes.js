const express = require('express');
const {
  getCompanyReviews,
  createCompanyReview,
  deleteCompanyReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCompanyReviews);
router.post('/', protect, createCompanyReview);
router.delete('/:id', protect, deleteCompanyReview);

module.exports = router;

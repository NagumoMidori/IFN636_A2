const express = require('express');
const {
  createReview,
  getReviewsByTour,
  getMyReviewForTour,
  updateReview,
  updateReviewStatus
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/tour/:tourId', getReviewsByTour);
router.get('/my/:tourId', protect, getMyReviewForTour);
router.put('/:id', protect, updateReview);
router.patch('/:id/status', protect, adminOnly, updateReviewStatus);

module.exports = router;

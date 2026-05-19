const mongoose = require('mongoose');
const Review = require('../models/Review');
const Tour = require('../models/Tour');
const ReviewFacade = require('../facades/reviewFacade');

const isValidReviewData = ({ rating, comment }) => {
  const numericRating = Number(rating);
  return Number.isFinite(numericRating)
    && numericRating >= 1
    && numericRating <= 5
    && typeof comment === 'string'
    && comment.trim().length > 0;
};

exports.createReview = async (req, res) => {
  try {
    const { tour, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tour) || !isValidReviewData({ rating, comment })) {
      return res.status(400).json({ message: 'Invalid review data' });
    }

    const review = await ReviewFacade.createReview(req.user.id, {
      tour,
      rating: Number(rating),
      comment: comment.trim()
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username email')
      .populate('tour');

    res.status(201).json(populatedReview);
  } catch (error) {
    if (error.message === 'TOUR_NOT_FOUND') {
      return res.status(404).json({ message: 'Tour not found' });
    }
    if (error.message === 'NOT_PURCHASED') {
      return res.status(403).json({ message: 'You can only review tours you have purchased' });
    }
    if (error.message === 'DUPLICATE_REVIEW' || error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this tour' });
    }
    res.status(500).json({ message: 'Failed to create review' });
  }
};

exports.getReviewsByTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      return res.status(400).json({ message: 'Invalid tour id' });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const summary = await ReviewFacade.getTourReviewSummary(tourId);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

exports.getMyReviewForTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      return res.status(400).json({ message: 'Invalid tour id' });
    }

    const review = await Review.findOne({ user: req.user.id, tour: tourId })
      .populate('user', 'username email')
      .populate('tour');

    res.json({ review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch review' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !isValidReviewData({ rating, comment })) {
      return res.status(400).json({ message: 'Invalid review data' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own review' });
    }

    review.rating = Number(rating);
    review.comment = comment.trim();
    const updatedReview = await review.save();
    const populatedReview = await Review.findById(updatedReview._id)
      .populate('user', 'username email')
      .populate('tour');

    res.json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review' });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Visible', 'Hidden'];

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid review status' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'username email').populate('tour');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review status' });
  }
};

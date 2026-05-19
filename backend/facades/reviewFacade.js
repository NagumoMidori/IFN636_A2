const Review = require('../models/Review');
const Tour = require('../models/Tour');
const { PurchasedTourReviewEligibilityStrategy } = require('../strategies/reviewEligibilityStrategy');

class ReviewFacade {
  constructor(eligibilityStrategy = new PurchasedTourReviewEligibilityStrategy()) {
    this.eligibilityStrategy = eligibilityStrategy;
  }

  async createReview(userId, body) {
    const { tour, rating, comment } = body;

    const targetTour = await Tour.findById(tour);
    if (!targetTour) {
      throw new Error('TOUR_NOT_FOUND');
    }

    const existingReview = await Review.findOne({ user: userId, tour });
    if (existingReview) {
      throw new Error('DUPLICATE_REVIEW');
    }

    const eligibleOrder = await this.eligibilityStrategy.findEligibleOrder(userId, tour);
    if (!eligibleOrder) {
      throw new Error('NOT_PURCHASED');
    }

    return Review.create({
      user: userId,
      tour,
      order: eligibleOrder._id,
      rating,
      comment,
      status: 'Visible'
    });
  }

  async getTourReviewSummary(tourId) {
    const reviews = await Review.find({ tour: tourId, status: 'Visible' })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    const reviewCount = reviews.length;
    const averageRating = reviewCount === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount;

    const publicReviews = reviews.map((review) => ({
      _id: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: review.user ? { username: review.user.username } : null
    }));

    return {
      reviews: publicReviews,
      averageRating: Number(averageRating.toFixed(1)),
      reviewCount
    };
  }
}

module.exports = new ReviewFacade();

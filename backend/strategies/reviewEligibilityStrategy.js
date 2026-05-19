const Order = require('../models/Order');

class PurchasedTourReviewEligibilityStrategy {
  async findEligibleOrder(userId, tourId) {
    return Order.findOne({
      user: userId,
      status: { $ne: 'Cancelled' },
      'items.tour': tourId
    }).sort({ createdAt: -1 });
  }
}

module.exports = {
  PurchasedTourReviewEligibilityStrategy
};

class StandardPricingStrategy {
  calculateItem(cartItem, tour) {
    const quantity = Number(cartItem.quantity);
    const unitPrice = Number(tour.price);

    return {
      tour: tour._id,
      tourDate: cartItem.tourDate,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
      personalInfo: cartItem.personalInfo || {}
    };
  }
}

module.exports = {
  StandardPricingStrategy
};

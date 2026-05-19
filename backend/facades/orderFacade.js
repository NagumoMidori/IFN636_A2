const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Tour = require('../models/Tour');
const { StandardPricingStrategy } = require('../strategies/pricingStrategy');

class OrderFacade {
  constructor(pricingStrategy = new StandardPricingStrategy()) {
    this.pricingStrategy = pricingStrategy;
  }

  async checkoutCart(userId) {
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      throw new Error('EMPTY_CART');
    }

    const orderItems = [];

    for (const cartItem of cart.items) {
      const tour = await Tour.findById(cartItem.tour);

      if (!tour) {
        throw new Error('TOUR_NOT_FOUND');
      }

      orderItems.push(this.pricingStrategy.calculateItem(cartItem, tour));
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      status: 'Pending',
      paymentStatus: 'Paid'
    });

    await Cart.findOneAndDelete({ user: userId });

    return Order.findById(order._id).populate('items.tour');
  }
}

module.exports = new OrderFacade();

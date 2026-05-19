const mongoose = require('mongoose');
const Order = require('../models/Order');
const OrderFacade = require('../facades/orderFacade');

const populateOrder = (query) => query
  .populate('user', 'username email')
  .populate('items.tour');

const isAdmin = (user) => user && user.role === 'admin';

exports.createOrder = async (req, res) => {
  try {
    const order = await OrderFacade.checkoutCart(req.user.id);
    res.status(201).json(order);
  } catch (error) {
    if (error.message === 'EMPTY_CART') {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    if (error.message === 'TOUR_NOT_FOUND') {
      return res.status(404).json({ message: 'A tour in the cart no longer exists' });
    }
    res.status(500).json({ message: 'Failed to create order' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.tour')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await populateOrder(Order.find()).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const order = await populateOrder(Order.findById(req.params.id));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderUserId = order.user?._id?.toString() || order.user?.toString();
    if (orderUserId !== req.user.id && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'You do not have permission to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Cancelled'];

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'username email').populate('items.tour');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart actions require authentication
router.get('/', protect, cartController.getCart);
router.post('/add', protect, cartController.addToCart);
router.delete('/:cartItemId', protect, cartController.removeFromCart);
router.delete('/', protect, cartController.clearCart); // Payment.jsx Payment success then clear the cart.
router.patch('/update', protect, cartController.updateCart);
module.exports = router;
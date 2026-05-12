const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// 所有購物車操作都需要登入 (protect) Every cart action need to login to process
router.get('/', protect, cartController.getCart);
router.post('/add', protect, cartController.addToCart);
router.delete('/:tourId', protect, cartController.removeFromCart); //Cart.jsx Delete one item.
router.delete('/', protect, cartController.clearCart); // Payment.jsx Payment success then clear the cart.
module.exports = router;
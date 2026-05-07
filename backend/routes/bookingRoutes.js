const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
// 假設你有一個 admin 中間件，建議加上去保護 /all 路由
const { 
  createBooking, 
  getMyBookings, 
  getBookingById, 
  updateBooking, 
  deleteBooking,
  getAllBookings 
} = require('../controllers/bookingController');

// 1. 新增訂單
router.post('/', protect, createBooking);

// 2. 取得目前使用者的所有訂單 (固定路徑放在上方)
router.get('/my-bookings', protect, getMyBookings);

// 3. 取得全系統所有訂單 (固定路徑放在上方)
router.get('/all', protect, getAllBookings);

// 4. 取得特定 ID 訂單 (動態路徑放在下方，避免攔截 /all)
router.get('/:id', protect, getBookingById); 

// 5. 更新訂單
router.put('/:id', protect, updateBooking);

// 6. 徹底刪除訂單
router.delete('/:id', protect, deleteBooking);

module.exports = router;
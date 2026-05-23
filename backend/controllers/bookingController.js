const Booking = require('../models/Booking1');
const mongoose = require('mongoose'); 


// ✅ 1. 新增預訂
exports.createBooking = async (req, res) => {
  try {
    const { tour, tourDate, quantity, totalPrice, personalInfo } = req.body;
    const newBooking = new Booking({
      user: req.user.id,
      tour,
      tourDate,
      quantity,
      totalPrice,
      personalInfo
    });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ 2. 取得目前使用者的訂單列表
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('tour')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 3. 取得單一訂單 (增加 ID 檢查防止 500)
exports.getBookingById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Booking ID' });
    }
    const booking = await Booking.findById(req.params.id).populate('tour');
    if (!booking) return res.status(404).json({ message: '訂單不存在' });
    
    // 權限檢查
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: '無權限查看此訂單' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 4. 更新預訂
exports.updateBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Booking ID' });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: '找不到訂單' });
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ 5. 徹底刪除訂單
exports.deleteBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Booking ID' });
    }
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ 6. 取得全系統所有訂單 (Admin 專用)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'username email')
      .populate('tour')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // 關聯到使用者
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 關聯到行程
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  // 預訂日期 (對應 Figma 的日期選擇)
  tourDate: {
    type: String,
    required: true
  },
  // 人數 (Quantity)
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  // 總價
  totalPrice: {
    type: Number,
    required: true
  },
  // 個人資訊 (對應 Figma 填寫欄位)
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  // 訂單狀態
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String }, // 🔴 確保這行存在，否則照片網址存不進去
  status: { type: String, default: 'Available' },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
  importantNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema);
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  status: { type: String, default: 'Available' },
  type: { type: String,required: true, default: 'day' },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
  importantNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema);
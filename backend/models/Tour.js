const mongoose = require('mongoose');

const TOUR_TYPES = ['day', 'promo'];

const roundPrice = (value) => Math.round(Number(value || 0) * 100) / 100;

const calculateFinalPrice = (type, originalPrice) => {
  const normalizedPrice = roundPrice(originalPrice);
  return type === 'promo' ? roundPrice(normalizedPrice * 0.9) : normalizedPrice;
};

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  originalPrice: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String },
  status: { type: String, default: 'Available' },
  type: { type: String, enum: TOUR_TYPES, default: 'day' },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String, trim: true },
  importantNotes: { type: String, trim: true },
  capacity: { type: Number, min: 0 }
}, { timestamps: true });

tourSchema.pre('validate', function setFinalPrice(next) {
  if (this.originalPrice === undefined && this.price !== undefined) {
    this.originalPrice = this.price;
  }

  if (this.originalPrice !== undefined) {
    this.price = calculateFinalPrice(this.type, this.originalPrice);
  }

  next();
});

tourSchema.pre('findOneAndUpdate', async function setFinalPriceOnUpdate(next) {
  const update = this.getUpdate() || {};
  const updateData = update.$set || update;

  if (
    updateData.originalPrice === undefined
    && updateData.price === undefined
    && updateData.type === undefined
  ) {
    return next();
  }

  const currentTour = await this.model.findOne(this.getQuery()).lean();
  const nextType = updateData.type || currentTour?.type || 'day';
  const nextOriginalPrice = updateData.originalPrice
    ?? updateData.price
    ?? currentTour?.originalPrice
    ?? currentTour?.price;

  if (nextOriginalPrice !== undefined) {
    updateData.originalPrice = roundPrice(nextOriginalPrice);
    updateData.price = calculateFinalPrice(nextType, nextOriginalPrice);
  }

  if (!updateData.type) {
    updateData.type = nextType;
  }

  if (update.$set) {
    update.$set = updateData;
  }

  this.setUpdate(update);
  next();
});

module.exports = mongoose.model('Tour', tourSchema);

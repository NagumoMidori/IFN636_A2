const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [
        {
            tour: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tour',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            },
            tourDate: {
                type: String, required: true
            },
            personalInfo: {
                fullName: String,
                email: String,
                phone: String
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
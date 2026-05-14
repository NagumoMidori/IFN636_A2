const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Tour = require('../models/Tour');

class CartFacade {
    // Uniform formatted return content
    static formatResponse(cart, userId) {
        if (!cart) return {user: userId, items: []};
        return cart;
    }

// Get cart
    async getCart(userId) {
        const cart = await Cart.findOne({user: userId}).populate('items.tour');
        return CartFacade.formatResponse(cart, userId);
    }

    async addToCart(userId, body, isUpdate = false) {
        const { tourId, quantity, tourDate, personalInfo } = body;

        // validate information 
        if (!tourId || !tourDate || !quantity || quantity < 1) {
            throw new Error('BAD_REQUEST');
        }

        if (!mongoose.Types.ObjectId.isValid(tourId)) {
            throw new Error('BAD_REQUEST');
        }

        const tour = await Tour.findById(tourId);
        if (!tour) throw new Error('NOT_FOUND');

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if there are already any projects with the same itinerary and dates.
        const itemIndex = cart.items.findIndex(item => 
            item.tour.toString() === tourId && item.tourDate === tourDate
        );

        if (itemIndex > -1) {
            if (isUpdate) {
                cart.items[itemIndex].quantity = quantity; 
            } else {
                cart.items[itemIndex].quantity += quantity;
            }

            if (tourDate) cart.items[itemIndex].tourDate = tourDate;
            if (personalInfo) cart.items[itemIndex].personalInfo = personalInfo;
        } 
        else {
            cart.items.push({ tour: tourId, quantity, tourDate, personalInfo });
        }
        await cart.save();
        return this.getCart(userId); // return populated information
    }

    // remove item
    async removeItem(userId, cartItemId) {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);
            await cart.save();
        }
        return this.getCart(userId);
    }

    async clearCart(userId) {
        await Cart.findOneAndDelete({ user: userId });
        return { user: userId, items: [] };
    }


    async updateItem(userId, body) {
        const { cartItemId, quantity, tourDate, personalInfo } = body;

        if (!cartItemId || !mongoose.Types.ObjectId.isValid(cartItemId)) {
            throw new Error('BAD_REQUEST');
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) throw new Error('NOT_FOUND');

        const item = cart.items.id(cartItemId);
        
        if (item) {
            if (quantity !== undefined) item.quantity = quantity;
            if (tourDate) item.tourDate = tourDate;
            if (personalInfo) item.personalInfo = personalInfo;
            await cart.save();
        }

        return this.getCart(userId);
    }
}

module.exports = new CartFacade();
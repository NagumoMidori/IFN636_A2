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

    async addToCart(userId, body) {
        const { tourId, quantity, tourDate, personalInfo } = body;

        // validate information 
        if (!tourId || !tourDate || !quantity || quantity < 1) {
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
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ tour: tourId, quantity, tourDate, personalInfo });
        }

        await cart.save();
        return this.getCart(userId); // return populated information
    }

    // remove item
    async removeItem(userId, tourId) {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = cart.items.filter(item => item.tour.toString() !== tourId);
            await cart.save();
        }
        return this.getCart(userId); // ensure the format after remove
    }

    async clearCart(userId) {
        await Cart.findOneAndDelete({ user: userId });
        return { user: userId, items: [] };
    }
}

module.exports = new CartFacade();
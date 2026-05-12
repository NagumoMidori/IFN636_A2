const CartFacade = require('../facades/CartFacade');

// get cart
exports.getCart = async (req, res) => {
    try {
        const cart = await CartFacade.getCart(req.user.id);
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// add item to cart
exports.addToCart = async (req, res) => {
    try {
        const updatedCart = await CartFacade.addToCart(req.user.id, req.body);
        res.status(201).json(updatedCart);
    } catch (err) {
        // the corresponding status code is returned based on the error thrown by Facade.
        if (err.message === 'BAD_REQUEST') return res.status(400).json({ message: 'Invalid request data' });
        if (err.message === 'NOT_FOUND') return res.status(404).json({ message: 'Could not found the trip' });
        res.status(500).json({ message: 'Failed to add to cart' });
    }
};

// remove item
exports.removeFromCart = async (req, res) => {
    try {
        const updatedCart = await CartFacade.removeItem(req.user.id, req.params.tourId);
        res.json(updatedCart);
    } catch (err) {
        res.status(500).json({ message: 'Deletion failed' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        // call Facade clear cart logic
        const emptyCart = await CartFacade.clearCart(req.user.id);
        res.json(emptyCart);
    } catch (err) {
        res.status(500).json({ message: 'Failed to empty cart' });
    }
};
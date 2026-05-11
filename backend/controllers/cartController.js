const Cart = require('../models/Cart');

// 1. 獲取當前使用者的購物車內容 Get current users cart content
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.tour');
        
        if (!cart) {
            return res.status(200).json({ items: [] });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 2. 加入商品到購物車 Add tour to cart
exports.addToCart = async (req, res) => {
    const { tourId, quantity = 1 } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (cart) {
            // 檢查購物車內是否已有該行程 Check the cart already have this tour or not.
            const itemIndex = cart.items.findIndex(item => item.tour.toString() === tourId);

            if (itemIndex > -1) {
                // 已存在則增加數量 If it is exist, then add quantity
                cart.items[itemIndex].quantity += quantity;
            } 
            else {
                // 不存在則 Push 進陣列 If it is not exist, then push to array
                cart.items.push({ tour: tourId, quantity });
            }
            await cart.save();
        } 
        else {
            // 使用者第一次建立購物車 User create cart first time
            cart = await Cart.create({
                user: req.user.id,
                items: [{ tour: tourId, quantity }]
            });
        }
        
        const updatedCart = await Cart.findById(cart._id).populate('items.tour');
        res.status(201).json(updatedCart); 
    } catch (err) {
        res.status(500).json({ message: 'Failed to add to cart' });
    }
};

// 3. 從購物車刪除單一項目 Delete item from cart
exports.removeFromCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }); 
        
        if (cart) {
            cart.items = cart.items.filter(item => item.tour.toString() !== req.params.tourId);
            await cart.save();
            cart = await cart.populate('items.tour');
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete item' });
    }
};
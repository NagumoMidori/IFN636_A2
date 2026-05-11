import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. 從後端獲取購物車資料 get cart information from backend
    const fetchCart = async () => {
        try {
            const { data } = await axiosInstance.get('/api/cart');
            setCart(data);
        } catch (error) {
            console.error("Failed to get cart info", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. 加入購物車 add to cart
    const addToCart = async (tourId, quantity = 1) => {
        try {
            const { data } = await axiosInstance.post('/api/cart/add', { tourId, quantity });
            setCart(data);
            alert("Add to cart successfully!");
        } catch (error) {
            alert(error.response?.data?.message || "Please login first");
        }
    };

    // 3. 刪除項目 delete item
    const removeFromCart = async (tourId) => {
        try {
            const { data } = await axiosInstance.delete(`/api/cart/${tourId}`);
            setCart(data);
        } catch (error) {
            console.error("Failed to delete item", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from './AuthContext';

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
    const addToCart = async (tourId, quantity, tourDate, personalInfo) => {
        try{    
            const { data } = await axiosInstance.post('/api/cart/add', { 
                tourId, quantity, tourDate, personalInfo 
            });
            setCart(data);
            alert("Add to cart successfully!");
        }
        catch (error){
            alert(error.response?.data?.message || "Please login first.");
            throw error;
        }
    };
    // 3. update item
    const updateCartItem = async (cartItemId, updates) => { // 參數改為 cartItemId
        try {
            const currentItem = cart.items.find(item => item._id === cartItemId);
            if (!currentItem) return;

            const { data } = await axiosInstance.patch('/api/cart/update', { 
                cartItemId, 
                quantity: updates.quantity !== undefined ? updates.quantity : currentItem.quantity,
                tourDate: updates.tourDate || currentItem.tourDate,
                personalInfo: updates.personalInfo || currentItem.personalInfo
            });
            
            setCart(data);
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    // 4. 刪除項目 delete item
    const removeFromCart = async (cartItemId) => {
        try {
            const { data } = await axiosInstance.delete(`/api/cart/${cartItemId}`);
            setCart(data);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const clearCart = () => setCart({ items: [] });

    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchCart();
        } 
        else {
            setCart({ items: [] });
            setLoading(false);
        }
    }, [user]); 

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItem, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
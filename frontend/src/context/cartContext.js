import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const { notifySuccess, notifyError } = useNotification();

    // 1. Fetch cart from backend
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

    // 2. Add to cart
    const addToCart = async (tourId, quantity, tourDate, personalInfo) => {
        try{    
            const { data } = await axiosInstance.post('/api/cart/add', { 
                tourId, quantity, tourDate, personalInfo 
            });
            setCart(data);
            notifySuccess('Added to cart.');
        }
        catch (error){
            notifyError(error.response?.data?.message || 'Please sign in before adding a tour to your cart.');
            throw error;
        }
    };
    // 3. update item
    const updateCartItem = async (cartItemId, updates) => {
        // Safety check: ensure cart exists and items is an array
        if (!cart || !Array.isArray(cart.items)) {
            console.warn("Cart is not initialized yet.");
            return;
        }

        const currentItem = cart.items.find(item => item._id === cartItemId);
        if (!currentItem) return;

        try {
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

    // 4. Delete item
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
        if (user && user.role !== 'admin') {
            fetchCart();
        } else {
            setCart({ items: [] });
            setLoading(false);
        }
    }, [user]); 

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItem, clearCart, fetchCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialize session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    const newSessionId = storedSessionId || `session_${Date.now()}_${Math.random()}`;
    
    if (!storedSessionId) {
      localStorage.setItem('sessionId', newSessionId);
    }
    setSessionId(newSessionId);
  }, []);

  // Fetch cart when session ID is set
  useEffect(() => {
    if (sessionId) {
      fetchCart();
    }
  }, [sessionId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart(sessionId);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartService.addToCart(productId, sessionId, quantity);
      if (response.data.success) {
        await fetchCart();
        return { success: true, message: 'Added to cart' };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Error adding to cart' };
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      const response = await cartService.updateCartItem(cartItemId, quantity);
      if (response.data.success) {
        await fetchCart();
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      return { success: false };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await cartService.removeFromCart(cartItemId);
      if (response.data.success) {
        await fetchCart();
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartService.clearCart(sessionId);
      if (response.data.success) {
        setCart([]);
        return { success: true };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false };
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    sessionId,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

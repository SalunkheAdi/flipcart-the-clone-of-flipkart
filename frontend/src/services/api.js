import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Attach auth token from localStorage to every request if available
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Product Services
export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  searchProducts: (query) => api.get('/products/search', { params: { query } }),
  getCategories: () => api.get('/products/categories'),
};

// Cart Services
export const cartService = {
  getCart: (sessionId) => api.get('/cart', { params: { sessionId } }),
  addToCart: (productId, sessionId, quantity = 1) =>
    api.post('/cart', { productId, sessionId, quantity }),
  updateCartItem: (cartItemId, quantity) =>
    api.put(`/cart/${cartItemId}`, { quantity }),
  removeFromCart: (cartItemId) => api.delete(`/cart/${cartItemId}`),
  clearCart: (sessionId) => api.post('/cart/clear-cart', { sessionId }),
};

// Order Services
export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  // Get orders for the authenticated user
  getOrders: () => api.get('/orders'),
  getOrdersByEmail: (email) => api.get('/orders/by-email', { params: { email } }),
  updateOrderStatus: (orderId, status) =>
    api.put(`/orders/${orderId}`, { status }),
};

// Wishlist Services
export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  checkWishlist: (productId) => api.get(`/wishlist/${productId}`),
};

export default api;

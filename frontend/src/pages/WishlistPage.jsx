import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { wishlistService } from '../services/api';
import '../styles/WishlistPage.css';

function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      if (response.data.success) {
        setWishlist(response.data.data || []);
      }
    } catch (err) {
      setError('Error fetching wishlist');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await wishlistService.removeFromWishlist(productId);
      if (response.data.success) {
        setWishlist(wishlist.filter(item => item.id !== productId));
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product.id, 1);
    if (result?.success) {
      alert('Added to cart!');
    } else {
      alert('Error adding to cart');
    }
  };

  if (loading) {
    return <div className="wishlist-page"><div className="loading">Loading wishlist...</div></div>;
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h1>❤️ My Wishlist</h1>

        {error && <div className="error-message">{error}</div>}

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <p>Your wishlist is empty</p>
            <button onClick={() => navigate('/')} className="continue-shopping">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div key={product.id} className="wishlist-card">
                <div className="product-image-container">
                  <img src={product.image_url} alt={product.name} className="product-image" />
                  {product.discount_percentage && (
                    <div className="discount-badge">{product.discount_percentage}% OFF</div>
                  )}
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  
                  <div className="price-section">
                    <span className="current-price">₹{product.price}</span>
                    {product.original_price && (
                      <span className="original-price">₹{product.original_price}</span>
                    )}
                  </div>

                  {product.rating && (
                    <div className="rating">
                      <span className="stars">★ {product.rating}</span>
                      <span className="reviews">({product.reviews_count} reviews)</span>
                    </div>
                  )}

                  <div className="stock-status">
                    {product.stock > 0 ? (
                      <span className="in-stock">In Stock</span>
                    ) : (
                      <span className="out-of-stock">Out of Stock</span>
                    )}
                  </div>

                  <div className="action-buttons">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="add-to-cart-btn"
                      disabled={product.stock === 0}
                    >
                      🛒 Add to Cart
                    </button>
                    <button 
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="remove-btn"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;

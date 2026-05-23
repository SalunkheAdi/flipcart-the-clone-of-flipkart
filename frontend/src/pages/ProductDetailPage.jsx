import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { productService, wishlistService } from '../services/api';
import '../styles/ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && product?.id) {
      checkWishlistStatus(product.id);
    } else {
      setIsInWishlist(false);
    }
  }, [isAuthenticated, product?.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      if (response.data.success) {
        setProduct(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      alert(`Added ${quantity} item(s) to cart!`);
    } else {
      alert('Error adding to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      navigate('/checkout');
    }
  };

  const checkWishlistStatus = async (productId) => {
    try {
      const response = await wishlistService.checkWishlist(productId);
      if (response.data.success) {
        setIsInWishlist(response.data.inWishlist);
      }
    } catch (err) {
      console.error('Error checking wishlist:', err);
    }
  };

  const handleSaveForLater = async () => {
    if (!isAuthenticated) {
      alert('Please login to save items for later');
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        const response = await wishlistService.removeFromWishlist(product.id);
        if (response.data.success) {
          setIsInWishlist(false);
          alert('Removed from wishlist');
        }
      } else {
        const response = await wishlistService.addToWishlist(product.id);
        if (response.data.success) {
          setIsInWishlist(true);
          alert('Added to wishlist!');
        }
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
      alert('Error updating wishlist');
    }
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  let specifications = {};
  if (product.specifications) {
    if (typeof product.specifications === 'string') {
      try {
        specifications = JSON.parse(product.specifications);
      } catch (e) {
        console.error('Failed to parse product specifications:', e);
        specifications = {}; // Fallback to empty object on error
      }
    } else {
      specifications = product.specifications;
    }
  }
  const discount = product.discount_percentage || 0;

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        <div className="image-section">
          <ImageCarousel 
            images={[product.image_url]}
            productName={product.name}
          />
        </div>

        <div className="detail-section">
          <h1 className="product-title">{product.name}</h1>

          <div className="rating-info">
            <span className="rating-value">★ {product.rating}</span>
            <span className="reviews-count">{product.reviews_count} Reviews</span>
          </div>

          <div className="price-section">
            <span className="current-price">₹{product.price}</span>
            {product.original_price > product.price && (
              <>
                <span className="original-price">₹{product.original_price}</span>
                <span className="discount-percent">{discount}% off</span>
              </>
            )}
          </div>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="description-section">
            <h3>About this product</h3>
            <p>{product.description}</p>
          </div>

          {Object.keys(specifications).length > 0 && (
            <div className="specifications-section">
              <h3>Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {Object.entries(specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-label">{key}</td>
                      <td className="spec-value">{JSON.stringify(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="action-section">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-control">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity === 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity === product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="button-group">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                🛒 Add to Cart
              </button>
              <button
                className={`save-for-later-btn ${isInWishlist ? 'active' : ''}`}
                onClick={handleSaveForLater}
                title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isInWishlist ? 'Saved' : 'Save for Later'}
              </button>
              <button 
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;

import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const placeholderImage = `https://placehold.co/400x300.png?text=${encodeURIComponent(product.name)}`;

  const getImageSrc = (url) => {
    if (!url) return placeholderImage;
    if (url.startsWith('/images/') || url.startsWith('images/')) return placeholderImage;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return placeholderImage;
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleViewDetails}>
      <div className="product-image-container">
        <img
          src={getImageSrc(product.image_url)}
          alt={product.name}
          className="product-image"
          onError={(event) => { event.target.src = placeholderImage; }}
        />
        {product.discount_percentage > 0 && (
          <div className="discount-badge">
            {product.discount_percentage}% OFF
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name.substring(0, 50)}</h3>

        <div className="price-section">
          <span className="current-price">Rs.{product.price}</span>
          {product.original_price > product.price && (
            <span className="original-price">Rs.{product.original_price}</span>
          )}
        </div>

        <div className="rating-section">
          <span className="rating-stars">★ {product.rating}</span>
          <span className="reviews-count">({product.reviews_count})</span>
        </div>

        <div className="stock-status">
          {product.stock > 0 ? (
            <span className="in-stock">In Stock</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

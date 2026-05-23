import '../styles/ImageCarousel.css';
import { useState } from 'react';

function ImageCarousel({ images = [], productName = '' }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const placeholder = `https://placehold.co/800x600.png?text=${encodeURIComponent(productName || 'Product')}`;
  const getImageUrl = (url) => {
    if (!url) return placeholder;
    if (url.startsWith('/images/') || url.startsWith('images/')) return placeholder;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return placeholder;
  };

  const displayImages = images.length > 0 ? images.map(getImageUrl) : [placeholder];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="image-carousel">
      <div className="main-image-container">
        <img 
          src={displayImages[currentImageIndex]} 
          alt={productName}
          className="main-image"
          onError={(event) => { event.target.src = placeholder; }}
        />
        {displayImages.length > 1 && (
          <>
            <button className="carousel-btn prev-btn" onClick={handlePrevious}>
              ❮
            </button>
            <button className="carousel-btn next-btn" onClick={handleNext}>
              ❯
            </button>
          </>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="thumbnail-container">
          {displayImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${productName} ${index + 1}`}
              className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
              onError={(event) => { event.target.src = placeholder; }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;

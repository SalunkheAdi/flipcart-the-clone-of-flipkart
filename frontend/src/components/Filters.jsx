import { useState, useEffect } from 'react';
import '../styles/Filters.css';

function Filters({ onFilterChange, categories }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      priceRange,
      sortBy
    });
  }, [selectedCategory, priceRange, sortBy]);

  return (
    <div className="filters-container">
      <div className="filter-section">
        <h3 className="filter-title">Filters</h3>
      </div>

      <div className="filter-section">
        <h4>Category</h4>
        <div className="category-list">
          <label className="filter-option">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ''}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
            <span>All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category} className="filter-option">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Sort By</h4>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="popularity">Popularity</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-range">
          <input
            type="range"
            min="0"
            max="200000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="price-slider"
          />
          <div className="price-display">
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;

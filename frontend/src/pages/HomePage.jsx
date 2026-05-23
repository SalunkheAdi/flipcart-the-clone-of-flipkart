import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import Filters from '../components/Filters.jsx';
import { productService } from '../services/api';
import '../styles/HomePage.css';

function HomePage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 200000],
    sortBy: 'popularity'
  });

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilters(prev => ({ ...prev, category }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const search = searchParams.get('search');
      
      let params = {};
      if (filters.category) params.category = filters.category;
      if (search) params.search = search;
      params.minPrice = filters.priceRange[0];
      params.maxPrice = filters.priceRange[1];
      
      // Convert sortBy to sort and order parameters
      if (filters.sortBy === 'price-asc') {
        params.sort = 'price';
        params.order = 'asc';
      } else if (filters.sortBy === 'price-desc') {
        params.sort = 'price';
        params.order = 'desc';
      } else if (filters.sortBy === 'rating') {
        params.sort = 'rating';
        params.order = 'desc';
      } else if (filters.sortBy === 'newest') {
        params.sort = 'newest';
        params.order = 'desc';
      }

      const response = await productService.getAllProducts(params);
      if (response.data.success) {
        const filteredProducts = response.data.data.filter((product) => {
          const price = Number(product.price);
          return price >= filters.priceRange[0] && price <= filters.priceRange[1];
        });
        setProducts(filteredProducts);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="page-container">
        <aside className="sidebar">
          <Filters 
            onFilterChange={setFilters}
            categories={categories}
          />
        </aside>

        <div className="main-content-area">
          <ProductGrid 
            products={products}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;

import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { productService } from '../services/api';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await productService.searchProducts(query);
        if (response.data.success) {
          setSearchResults(response.data.data);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleProductSelect = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/?search=${searchQuery}`);
    setShowSearchResults(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🛒</span>
            <span className="logo-text">Flipcart</span>
          </div>
          
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                🔍
              </button>
              
              {showSearchResults && searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="search-result-item"
                      onClick={() => handleProductSelect(result.id)}
                    >
                      <img src={result.image_url} alt={result.name} />
                      <div className="result-info">
                        <p className="result-name">{result.name}</p>
                        <p className="result-price">₹{result.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="navbar-right">
          <div className="nav-link" onClick={() => navigate('/')}>
            <span className="icon">🏠</span>
            <span>Home</span>
          </div>
          
          <div className="nav-link cart-link" onClick={() => navigate('/cart')}>
            <span className="icon">🛒</span>
            <span>Cart</span>
            {getCartItemCount() > 0 && (
              <span className="cart-badge">{getCartItemCount()}</span>
            )}
          </div>

          {isAuthenticated ? (
            <div className="user-menu-container">
              <div className="nav-link user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
                <span className="icon">👤</span>
                <span>{user?.name?.split(' ')[0]}</span>
              </div>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <p>{user?.name}</p>
                    <p className="email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={() => { navigate('/orders'); setShowUserMenu(false); }} className="dropdown-item">
                    📋 My Orders
                  </button>
                  <button onClick={() => { navigate('/wishlist'); setShowUserMenu(false); }} className="dropdown-item">
                    ❤️ Wishlist
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <button onClick={() => navigate('/login')} className="auth-btn login-btn">
                Login
              </button>
              <button onClick={() => navigate('/signup')} className="auth-btn signup-btn">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

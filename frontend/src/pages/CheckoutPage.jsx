import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { orderService } from '../services/api';
import '../styles/CheckoutPage.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, sessionId, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    state: '',
    paymentMethod: 'cod'
  });

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart-message">
          <p>Your cart is empty. Please add items before checkout.</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail || !formData.shippingAddress) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        ...formData,
        cartItems: cart,
        totalAmount: getCartTotal() * 1.18,
        sessionId
      };

      const response = await orderService.createOrder(orderData);

      if (response.data.success) {
        await clearCart();
        navigate(`/order-confirmation/${response.data.data.orderId}`);
      } else {
        alert('Error creating order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form-section">
          <h1>Checkout</h1>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>Delivery Address</h2>

              <input
                type="text"
                name="customerName"
                placeholder="Full Name *"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="form-input"
              />

              <input
                type="email"
                name="customerEmail"
                placeholder="Email Address *"
                value={formData.customerEmail}
                onChange={handleInputChange}
                required
                className="form-input"
              />

              <input
                type="tel"
                name="customerPhone"
                placeholder="Phone Number"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="form-input"
              />

              <textarea
                name="shippingAddress"
                placeholder="Shipping Address *"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                required
                rows="4"
                className="form-textarea"
              />

              <div className="form-row">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input"
                />

                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>

              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    readOnly
                  />
                  <span className="payment-label">Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="checkout-summary-section">
          <div className="summary-box">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>Rs.{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>Rs.{getCartTotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span className="free">FREE</span>
            </div>

            <div className="summary-row">
              <span>Tax (18%):</span>
              <span>Rs.{(getCartTotal() * 0.18).toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>Rs.{(getCartTotal() * 1.18).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

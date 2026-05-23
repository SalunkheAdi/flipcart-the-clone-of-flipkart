import { useParams, useNavigate } from 'react-router-dom';
import '../styles/OrderConfirmationPage.css';

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-box">
          <div className="success-icon">✓</div>
          
          <h1>Order Confirmed!</h1>
          
          <p className="confirmation-message">
            Thank you for your order. Your order has been successfully placed.
          </p>

          <div className="order-id-box">
            <p className="order-id-label">Order ID:</p>
            <p className="order-id-value">{orderId}</p>
          </div>

          <div className="confirmation-details">
            <p>📧 A confirmation email has been sent to your registered email address.</p>
            <p>📦 You will receive a shipping notification soon.</p>
            <p>🚚 Estimated delivery: 3-5 business days</p>
          </div>

          <div className="button-group">
            <button className="continue-shopping-btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
            <button className="track-order-btn" onClick={() => navigate('/orders')}>
              My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;

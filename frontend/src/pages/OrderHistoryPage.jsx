import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { orderService } from '../services/api';
import '../styles/OrderHistory.css';

function OrderHistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.email) {
      fetchOrders();
    }
  }, [isAuthenticated, navigate, user?.email]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrdersByEmail(user.email);
      if (response.data.success) {
        setOrders(response.data.data || []);
        setError('');
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError('Error fetching orders');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-history">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="order-container">
        <h1>My Orders</h1>

        {error && <div className="error-message">{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>No orders yet</p>
            <button onClick={() => navigate('/')} className="continue-shopping">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.order_id}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-total">
                    <p className="total-label">Total</p>
                    <p className="total-amount">Rs.{parseFloat(order.total_amount).toFixed(2)}</p>
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-row">
                    <span className="label">Payment Method:</span>
                    <span className="value">{order.payment_method || 'Not specified'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Shipping Address:</span>
                    <span className="value">{order.shipping_address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{order.customer_email}</span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items?.length || 0})</h4>
                  {order.items && order.items.length > 0 ? (
                    <div className="items-list">
                      {order.items.map((item) => (
                        <div key={item.id} className="item">
                          <span className="item-name">{item.product_name || item.name}</span>
                          <span className="item-qty">x{item.quantity}</span>
                          <span className="item-price">Rs.{parseFloat(item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-items">No items in this order</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryPage;

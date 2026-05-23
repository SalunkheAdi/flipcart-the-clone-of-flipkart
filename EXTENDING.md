# Extending Flipcart Clone - Feature Addition Guide

This guide helps you add new features to the project.

## 📋 Before You Start

- Ensure app runs locally
- Understand the current codebase
- Read API_REFERENCE.md
- Plan your feature

---

## Adding New Pages

### Step 1: Create React Component

File: `frontend/src/pages/NewPage.jsx`

```jsx
import '../styles/NewPage.css';
import { useState, useEffect } from 'react';

function NewPage() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Fetch data or initialize
  }, []);

  return (
    <div className="new-page">
      {/* Your component content */}
    </div>
  );
}

export default NewPage;
```

### Step 2: Create CSS

File: `frontend/src/styles/NewPage.css`

```css
.new-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Your styles */
```

### Step 3: Add Route

Edit `frontend/src/App.jsx`:

```jsx
import NewPage from './pages/NewPage.jsx';

// Add route in Routes component
<Route path="/new-page" element={<NewPage />} />
```

### Step 4: Add Navigation Link

Edit `frontend/src/components/Navbar.jsx`:

```jsx
<div className="nav-link" onClick={() => navigate('/new-page')}>
  <span className="icon">📄</span>
  <span>New Page</span>
</div>
```

---

## Adding Backend API Endpoint

### Step 1: Create Controller Function

File: `backend/controllers/newController.js`

```javascript
import pool from '../config/database.js';

export async function getNewData(req, res) {
  try {
    const result = await pool.query('SELECT * FROM table_name');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error' });
  }
}

export async function createNewData(req, res) {
  try {
    const { field1, field2 } = req.body;
    const result = await pool.query(
      'INSERT INTO table_name (field1, field2) VALUES ($1, $2) RETURNING *',
      [field1, field2]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error' });
  }
}
```

### Step 2: Create Route

File: `backend/routes/newRoutes.js`

```javascript
import express from 'express';
import { getNewData, createNewData } from '../controllers/newController.js';

const router = express.Router();

router.get('/', getNewData);
router.post('/', createNewData);

export default router;
```

### Step 3: Mount Route

Edit `backend/server.js`:

```javascript
import newRoutes from './routes/newRoutes.js';

app.use('/api/new', newRoutes);
```

### Step 4: Test Endpoint

```bash
curl http://localhost:5000/api/new
```

---

## Adding Database Table

### Step 1: Create Migration SQL

File: `backend/database/migrations/001_create_table.sql`

```sql
CREATE TABLE IF NOT EXISTS new_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_new_table_name ON new_table(name);
```

### Step 2: Run Migration

```bash
psql -U postgres -d flipkart -f database/migrations/001_create_table.sql
```

### Step 3: Update Seed File

Edit `backend/database/seed.js`:

```javascript
const newTableData = [
  { name: 'Item 1', description: 'Description' },
  { name: 'Item 2', description: 'Description' }
];

// Add to seedDatabase function
for (const item of newTableData) {
  await pool.query(
    'INSERT INTO new_table (name, description) VALUES ($1, $2)',
    [item.name, item.description]
  );
}
```

---

## Adding Authentication

### Step 1: Install bcrypt

```bash
cd backend
npm install bcrypt jsonwebtoken
```

### Step 2: Create Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 3: Create Auth Controller

```javascript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
}
```

### Step 4: Create Middleware

```javascript
import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}
```

### Step 5: Add Frontend Service

```javascript
// frontend/src/services/auth.js
import api from './api';

export const authService = {
  register: (email, password, name) => 
    api.post('/auth/register', { email, password, name }),
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  logout: () => {
    localStorage.removeItem('token');
  },
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token)
};
```

---

## Adding Payment Integration (Stripe)

### Step 1: Install Stripe

```bash
cd backend
npm install stripe

cd ../frontend
npm install @stripe/react-stripe-js @stripe/js
```

### Step 2: Create Payment Controller

```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req, res) {
  try {
    const { amount, orderId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: { orderId }
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment failed' });
  }
}
```

### Step 3: Create Checkout Component

```jsx
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

export function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async (e) => {
    e.preventDefault();
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });
    
    if (error) {
      console.error(error);
    } else {
      console.log('Payment successful', paymentIntent);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <CardElement />
      <button type="submit">Pay</button>
    </form>
  );
}
```

---

## Adding Product Reviews

### Step 1: Create Reviews Table

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id),
  user_name VARCHAR(255),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 2: Create Review Controller

```javascript
export async function addReview(req, res) {
  try {
    const { productId, userName, rating, comment } = req.body;
    const result = await pool.query(
      'INSERT INTO reviews (product_id, user_name, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [productId, userName, rating, comment]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding review' });
  }
}
```

---

## Adding Wishlist Feature

### Step 1: Create Wishlist Table

```sql
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id),
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 2: Add Wishlist API

```javascript
export async function addToWishlist(req, res) {
  const { productId, sessionId } = req.body;
  const result = await pool.query(
    'INSERT INTO wishlists (product_id, session_id) VALUES ($1, $2) RETURNING *',
    [productId, sessionId]
  );
  res.json({ success: true, data: result.rows[0] });
}
```

---

## Adding Product Images

### Step 1: Create Assets Directory Structure

```
frontend/src/assets/
├── images/
│   ├── products/
│   │   ├── mobiles/
│   │   ├── fashion/
│   │   ├── electronics/
│   │   └── grocery/
│   └── icons/
└── placeholder.jpg
```

### Step 2: Update Product URLs

Edit `backend/database/seed.js`:

```javascript
image_url: '/assets/images/products/mobiles/samsung-s24.jpg'
```

### Step 3: Serve Static Files

Edit `backend/server.js`:

```javascript
app.use('/assets', express.static(path.join(__dirname, '../frontend/src/assets')));
```

---

## Adding Email Notifications

### Step 1: Install Nodemailer

```bash
npm install nodemailer
```

### Step 2: Create Email Service

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendOrderConfirmation(email, orderId) {
  await transporter.sendMail({
    to: email,
    subject: 'Order Confirmation',
    html: `Your order ${orderId} has been confirmed!`
  });
}
```

### Step 3: Send Email on Order

```javascript
// In orderController.js
await sendOrderConfirmation(customerEmail, orderId);
```

---

## Adding Analytics

### Step 1: Create Analytics Table

```sql
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100),
  product_id INT,
  user_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 2: Track Events

```javascript
export async function trackEvent(eventType, productId, userId) {
  await pool.query(
    'INSERT INTO analytics (event_type, product_id, user_id) VALUES ($1, $2, $3)',
    [eventType, productId, userId]
  );
}
```

---

## Adding Admin Dashboard

### Step 1: Create Admin Page

File: `frontend/src/pages/AdminPage.jsx`

```jsx
function AdminPage() {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      {/* Stats, charts, order management */}
    </div>
  );
}
```

### Step 2: Create Admin API

```javascript
export async function getDashboardStats(req, res) {
  const totalOrders = await pool.query('SELECT COUNT(*) FROM orders');
  const totalRevenue = await pool.query('SELECT SUM(total_amount) FROM orders');
  
  res.json({
    success: true,
    data: {
      totalOrders: totalOrders.rows[0].count,
      totalRevenue: totalRevenue.rows[0].sum
    }
  });
}
```

---

## Best Practices for Adding Features

1. **Database First**
   - Design schema before code
   - Create migrations
   - Add indexes for queries

2. **Backend First**
   - Create API endpoint
   - Test with curl
   - Document in API_REFERENCE.md

3. **Frontend Second**
   - Create components
   - Add styles
   - Integrate with API

4. **Testing**
   - Test locally first
   - Test all edge cases
   - Test error scenarios

5. **Documentation**
   - Update README.md
   - Document new APIs
   - Add code comments

---

## Common Patterns

### API Call Pattern
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await someService.getData();
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### Form Handling Pattern
```jsx
const [formData, setFormData] = useState({ field1: '', field2: '' });

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await service.create(formData);
    if (result.success) {
      alert('Success!');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

---

## Testing Your Feature

1. **Manual Testing**
   - Use browser
   - Test happy path
   - Test error cases

2. **API Testing**
   - Use curl or Postman
   - Test with different inputs
   - Check response formats

3. **Database Testing**
   - Verify data saved
   - Check integrity
   - Test relationships

---

## Deployment Steps

1. Test locally thoroughly
2. Commit to git
3. Push to GitHub
4. Deploy backend
5. Deploy frontend
6. Test in production
7. Monitor for errors

---

## Resources

- Express.js Documentation: https://expressjs.com
- React Documentation: https://react.dev
- PostgreSQL Documentation: https://www.postgresql.org/docs
- Vite Documentation: https://vitejs.dev

---

## Getting Help

1. Check existing code for patterns
2. Review API_REFERENCE.md
3. Check documentation files
4. Test with console.log and Network tab
5. Use database CLI to verify data

---

**Happy coding! Add great features! 🚀**

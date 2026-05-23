# Flipcart Clone - Full Stack E-Commerce Application

A complete, production-ready e-commerce application built with React, Node.js, and PostgreSQL. Features a modern, responsive UI similar to Flipkart with full shopping cart, checkout, and order management functionality.

## 🚀 Features

### Frontend
- **Modern UI**: Blue navbar with search functionality, responsive product grid
- **Product Browsing**: Category filters, search, sorting, and product details
- **Shopping Cart**: Add/remove items, quantity management, persistent session
- **Checkout**: Multi-step form with address details
- **Order Management**: Order confirmation with order ID generation
- **Responsive Design**: Mobile, tablet, and desktop support
- **Context API**: Global cart state management

### Backend
- **REST APIs**: Complete product, cart, and order management endpoints
- **Database**: PostgreSQL with proper schema design
- **Transaction Support**: Atomic order creation with inventory tracking
- **Session Management**: Session-based cart persistence
- **Error Handling**: Comprehensive error management

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)
- Git (optional)

## ⚙️ Installation & Setup

### 1. PostgreSQL Setup

First, create a PostgreSQL database:

```bash
# Open PostgreSQL CLI
psql -U postgres

# Create database
CREATE DATABASE flipkart;

# Connect to database
\c flipkart

# Exit psql
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Update .env with your PostgreSQL credentials
# Edit .env file:
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flipkart
PORT=5000
NODE_ENV=development
```

#### Initialize Database Schema

```bash
# From backend directory (creates products, cart, orders, users, wishlist tables)
npm run db:init

# Or with psql directly:
psql -U postgres -d flipkart -f database/schema.sql
```

#### Seed Sample Data

```bash
# From backend directory
npm run seed
```

#### Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional - defaults work fine)
copy .env.example .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
flipcart_clone/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.js
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── ProductGrid.jsx
    │   │   ├── Filters.jsx
    │   │   └── ImageCarousel.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   └── OrderConfirmationPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── context/
    │   │   └── CartContext.jsx
    │   ├── styles/
    │   │   ├── index.css
    │   │   ├── App.css
    │   │   ├── Navbar.css
    │   │   ├── ProductCard.css
    │   │   ├── ProductGrid.css
    │   │   ├── Filters.css
    │   │   ├── ImageCarousel.css
    │   │   ├── HomePage.css
    │   │   ├── ProductDetailPage.css
    │   │   ├── CartPage.css
    │   │   ├── CheckoutPage.css
    │   │   └── OrderConfirmationPage.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── .env.example
    └── .gitignore
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products with filtering/sorting
- `GET /api/products/:id` - Get product details
- `GET /api/products/search` - Search products
- `GET /api/products/categories` - Get all categories

### Cart
- `GET /api/cart` - Get cart items for session
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/cart/clear-cart` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order details
- `GET /api/orders/by-email` - Get orders by email
- `PUT /api/orders/:orderId` - Update order status

## 📊 Database Schema

### Products Table
```sql
- id (Primary Key)
- name, description, category
- price, original_price, discount_percentage
- rating, reviews_count
- stock
- image_url
- specifications (JSONB)
- created_at, updated_at
```

### Cart Items Table
```sql
- id (Primary Key)
- product_id (Foreign Key)
- quantity
- session_id
- created_at, updated_at
```

### Orders Table
```sql
- id (Primary Key)
- order_id (Unique)
- customer_name, customer_email, customer_phone
- shipping_address, city, postal_code, state
- total_amount
- status (pending, confirmed, shipped, delivered, cancelled)
- created_at, updated_at
```

### Order Items Table
```sql
- id (Primary Key)
- order_id (Foreign Key)
- product_id (Foreign Key)
- quantity, price
- created_at
```

## 🎨 UI Features

- **Navbar**: Blue header with logo, search bar, and cart icon
- **Product Cards**: Image, title, price, rating, discount badge
- **Filters**: Category, price range, sorting options
- **Search**: Real-time product search with suggestions
- **Product Detail**: Large image, description, specifications, carousel
- **Cart**: Item quantity control, price calculation, remove options
- **Checkout**: Form validation, order summary, order placement
- **Order Confirmation**: Success message with order ID and tracking

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (3+ column grid)
- **Tablet**: 768px - 1199px (2 column grid)
- **Mobile**: Below 768px (1 column grid)

## 🚢 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full production checklist (env vars, Render + Vercel steps, troubleshooting).

### Deploy Backend on Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub/email

2. **Create New Web Service**
   - Connect GitHub repository
   - Select backend directory
   - Set environment:
     - Runtime: Node
     - Build Command: `npm install`
     - Start Command: `npm start`

3. **Add Environment Variables**
   - DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, PORT, NODE_ENV

4. **Connect PostgreSQL**
   - Use Render's PostgreSQL database or external PostgreSQL
   - Update connection strings

### Deploy Frontend on Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub/email

2. **Import Project**
   - Connect GitHub repository
   - Select frontend directory
   - Vercel auto-detects Vite

3. **Configure**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**
   - `VITE_API_URL=<your-backend-render-url>`

5. **Deploy**
   - Vercel automatically deploys on push to main

## 📚 Key Technologies

### Frontend
- React 18
- React Router DOM
- Axios
- Vite
- Plain CSS (no frameworks)

### Backend
- Node.js
- Express.js
- PostgreSQL
- UUID (for order IDs)

## 🔐 Security Features

- CORS enabled for API security
- Input validation on backend
- Session-based cart management
- SQL injection prevention (parameterized queries)
- Error handling without exposing sensitive info

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
# Windows: Check Services
# Mac: brew services list
# Linux: sudo service postgresql status

# Test connection
psql -U postgres -c "SELECT version();"
```

### Port Already in Use
```bash
# Backend (port 5000)
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Kill process
# Windows: taskkill /PID <PID> /F
# Mac/Linux: kill -9 <PID>
```

### CORS Issues
- Ensure backend has CORS enabled
- Check API URL in frontend .env
- Verify proxy settings in vite.config.js

## 📝 Sample Data

The seed script includes 12 sample products across 4 categories:
- **Mobiles**: Samsung S24, iPhone 15, OnePlus 12
- **Fashion**: T-Shirts, Jeans, Tops
- **Electronics**: Headphones, Laptops
- **Grocery**: Rice, Oil, Almond Butter

## 🤝 Contributing

Feel free to fork, modify, and improve the project.

## 📄 License

This project is open source and available for educational purposes.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check console logs for detailed error messages

---

**Happy Coding! 🎉**

Build, deploy, and scale your e-commerce application with confidence!

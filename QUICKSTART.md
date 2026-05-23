# Quick Start Guide - Flipcart Clone

Get your e-commerce app running in 5 minutes!

## ⚡ Quick Setup (5 Steps)

### Step 1: Start PostgreSQL
```bash
# Windows: Check in Services or use pgAdmin
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
```

### Step 2: Create Database
```bash
psql -U postgres

# In PostgreSQL CLI:
CREATE DATABASE flipkart;
\c flipkart
\q
```

### Step 3: Initialize Backend
```bash
cd backend
npm install
cp .env.example .env

# Update .env if needed (default works for local setup)

# Run schema
psql -U postgres -d flipkart -f database/schema.sql

# Seed data
npm run seed

# Start backend
npm run dev
```

Backend runs on: http://localhost:5000

### Step 4: Initialize Frontend
```bash
cd frontend
npm install

# Start frontend
npm run dev
```

Frontend runs on: http://localhost:3000

### Step 5: Test the App
- Open http://localhost:3000
- Browse products
- Add to cart
- Complete checkout

## 🛠️ Available Commands

### Backend
```bash
npm start      # Production mode
npm run dev    # Development mode with auto-reload
npm run seed   # Seed database with sample products
```

### Frontend
```bash
npm run dev     # Development server
npm run build   # Build for production
npm run preview # Preview production build
```

## 📍 Directory Structure Quick Reference

```
Backend:  /backend/server.js (port 5000)
Frontend: /frontend/src/main.jsx (port 3000)
Database: PostgreSQL (localhost:5432)
```

## 🔍 API Testing

Test API endpoints with curl:

```bash
# Get all products
curl http://localhost:5000/api/products

# Search products
curl http://localhost:5000/api/products/search?query=samsung

# Get categories
curl http://localhost:5000/api/products/categories

# Health check
curl http://localhost:5000/api/health
```

## 🚀 Deploy to Production

### Frontend on Vercel
```bash
# 1. Push code to GitHub
# 2. Go to vercel.com
# 3. Import project
# 4. Set VITE_API_URL environment variable
# 5. Deploy!
```

### Backend on Render
```bash
# 1. Push code to GitHub
# 2. Go to render.com
# 3. Create new Web Service
# 4. Connect GitHub & select backend
# 5. Add environment variables
# 6. Deploy!
```

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Kill process: `kill -9 $(lsof -t -i :5000)` |
| Port 3000 in use | Kill process: `kill -9 $(lsof -t -i :3000)` |
| DB connection error | Check PostgreSQL is running |
| CORS error | Ensure backend is running on 5000 |
| Products not loading | Run `npm run seed` in backend |

## 📊 Sample Product Categories

- **Mobiles**: 3 products
- **Fashion**: 3 products
- **Electronics**: 3 products
- **Grocery**: 3 products

## 🎯 Feature Checklist

- ✅ Product listing with filters
- ✅ Product search
- ✅ Product detail page
- ✅ Shopping cart
- ✅ Checkout process
- ✅ Order confirmation
- ✅ Responsive design
- ✅ Session persistence
- ✅ Database seeding
- ✅ REST APIs

## 📱 Test on Mobile

Open http://localhost:3000 on phone or use browser DevTools mobile mode (F12)

## 🎨 Customize Styling

All CSS is in `frontend/src/styles/` - Easy to modify!

- Colors: Change `#1a73e8` (blue) to your brand color
- Fonts: Modify font-family in `index.css`
- Images: Add your own in `frontend/src/assets/`

## 💡 Next Steps

1. Add user authentication
2. Add payment gateway (Stripe, PayPal)
3. Add product reviews
4. Add wishlist feature
5. Add admin dashboard
6. Set up email notifications

## 📞 Need Help?

- Check console logs (Ctrl+Shift+J in browser)
- Check terminal for backend errors
- See full README.md for detailed documentation

---

**Ready to build? Start with Step 1! 🚀**

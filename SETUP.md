# Complete Setup & Installation Guide

## Prerequisites Installation

### Windows

#### 1. Install Node.js
- Download from https://nodejs.org (LTS version)
- Run installer and follow prompts
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

#### 2. Install PostgreSQL
- Download from https://www.postgresql.org/download/windows/
- Run installer
- Remember the superuser password
- Verify:
  ```bash
  psql --version
  ```

### Mac

#### 1. Install Node.js
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

#### 2. Install PostgreSQL
```bash
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Verify
psql --version
```

### Linux (Ubuntu/Debian)

#### 1. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Install PostgreSQL
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

---

## Step-by-Step Installation

### Phase 1: Database Setup

#### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database (you'll be prompted for password)
CREATE DATABASE flipkart;

# Connect to the new database
\c flipkart

# Verify connection (you should see your database)
\l

# Exit
\q
```

#### 2. Initialize Database Schema

Option A - Using SQL file:
```bash
# Navigate to backend folder
cd backend

# Run schema file
psql -U postgres -d flipkart -f database/schema.sql
```

Option B - Manual execution:
```bash
psql -U postgres -d flipkart

# Paste contents of database/schema.sql
# Execute
\q
```

Verify tables were created:
```bash
psql -U postgres -d flipcart

\dt
# You should see: products, cart_items, orders, order_items

\q
```

---

### Phase 2: Backend Setup

#### 1. Navigate to Backend Directory
```bash
cd backend
```

#### 2. Install Dependencies
```bash
npm install
```

Expected output shows these packages installed:
- express
- pg
- cors
- dotenv
- uuid
- nodemon (dev)

#### 3. Create Environment File
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

#### 4. Configure Environment Variables

Edit `.env` file:
```
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flipkart
PORT=5000
NODE_ENV=development
```

**Important**: Replace `your_postgres_password` with your actual PostgreSQL password!

#### 5. Seed Database with Sample Products
```bash
npm run seed
```

Expected output:
```
Starting database seeding...
Cleared existing data...
Successfully seeded 12 products
```

#### 6. Start Backend Server
```bash
# Development mode (auto-reload)
npm run dev

# Or production mode
npm start
```

Expected output:
```
Server running on http://localhost:5000
```

#### 7. Test Backend
Open new terminal:
```bash
# Test health check
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","message":"Server is running"}

# Get all products
curl http://localhost:5000/api/products

# Should return JSON array of products
```

Keep backend terminal open and running!

---

### Phase 3: Frontend Setup

#### 1. Open New Terminal
```bash
# Don't close the backend terminal!
# Open a new terminal window
```

#### 2. Navigate to Frontend Directory
```bash
cd frontend
```

#### 3. Install Dependencies
```bash
npm install
```

Expected packages:
- react
- react-dom
- react-router-dom
- axios
- vite (dev)
- @vitejs/plugin-react (dev)

#### 4. Create Environment File (Optional)
```bash
# Windows
copy .env.example .env.local

# Mac/Linux
cp .env.example .env.local
```

The default API URL (http://localhost:5000/api) should work fine for local development.

#### 5. Start Frontend Server
```bash
npm run dev
```

Expected output:
```
  Local:   http://localhost:3000/
  ready in 500ms.
```

#### 6. Open in Browser
- Open http://localhost:3000
- You should see the Flipcart Clone homepage
- Products should load from backend

---

## Verification Checklist

✅ **Database**
- [ ] PostgreSQL is running
- [ ] flipkart database created
- [ ] Schema tables created (check with `\dt`)
- [ ] 12 products seeded (check with `SELECT COUNT(*) FROM products;`)

✅ **Backend**
- [ ] Backend running on http://localhost:5000
- [ ] Health check returns OK
- [ ] `/api/products` returns product list
- [ ] No console errors

✅ **Frontend**
- [ ] Frontend running on http://localhost:3000
- [ ] Page loads without errors
- [ ] Products display in grid
- [ ] Search bar visible
- [ ] Cart icon visible

✅ **Integration**
- [ ] Click on product → opens detail page
- [ ] Add to cart works
- [ ] Cart count updates
- [ ] Go to cart page
- [ ] Checkout works
- [ ] Order confirmation shows

---

## Full Feature Testing Workflow

1. **Browse Products**
   - Open http://localhost:3000
   - Verify all 12 products load
   - Click category filters
   - Test search functionality

2. **View Product Details**
   - Click any product
   - View full description
   - See specifications
   - Try quantity selector

3. **Cart Operations**
   - Add item to cart
   - Verify cart badge updates
   - Go to cart page
   - Change quantities
   - Remove items
   - Total updates correctly

4. **Checkout**
   - Fill checkout form
   - Verify validation
   - Click "Place Order"
   - See order confirmation
   - Note order ID

5. **Multiple Items**
   - Add different categories
   - Verify all items in cart
   - Complete checkout
   - Verify all items in order

---

## Environment Variables Reference

### Backend (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| DB_USER | postgres | PostgreSQL username |
| DB_PASSWORD | - | PostgreSQL password |
| DB_HOST | localhost | Database host |
| DB_PORT | 5432 | Database port |
| DB_NAME | flipkart | Database name |
| PORT | 5000 | Backend server port |
| NODE_ENV | development | Environment |

### Frontend (.env.local - Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | http://localhost:5000/api | Backend API URL |

---

## Troubleshooting Setup Issues

### PostgreSQL Issues

**Error: "psql: command not found"**
- PostgreSQL not installed or not in PATH
- Reinstall PostgreSQL and add to PATH
- Restart terminal after installation

**Error: "FATAL: role 'postgres' does not exist"**
- PostgreSQL not fully installed
- On Mac: `brew reinstall postgresql`
- On Windows: Uninstall and reinstall PostgreSQL
- On Linux: `sudo apt-get reinstall postgresql`

**Error: "FATAL: password authentication failed"**
- Wrong password in .env
- Verify PostgreSQL password
- If forgot password, reset it through pgAdmin

**Error: "database 'flipkart' does not exist"**
- Run `CREATE DATABASE flipkart;` again
- Check spelling (case-sensitive on Linux)

### Node.js Issues

**Error: "npm: command not found"**
- Node.js not installed or not in PATH
- Reinstall Node.js
- Close and reopen terminal after install

**Error: "Cannot find module"**
- Dependencies not installed
- Run `npm install` in correct directory
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Port Issues

**Error: "EADDRINUSE: address already in use :::5000"**
```bash
# Kill existing process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Error: "EADDRINUSE: address already in use :::3000"**
```bash
# Similar as above but for port 3000
```

### Connection Issues

**Products not loading**
- Check backend is running (http://localhost:5000/api/health)
- Check browser console for errors (F12)
- Check backend console for error messages
- Verify VITE_API_URL in frontend .env

**"Cannot POST /cart"**
- Backend not running
- Check backend console
- Verify Routes are mounted in server.js

---

## Useful PostgreSQL Commands

```bash
# Connect to database
psql -U postgres -d flipcart

# List databases
\l

# Connect to database
\c flipcart

# List tables
\dt

# Describe table
\d products

# Query data
SELECT * FROM products LIMIT 5;
SELECT COUNT(*) FROM products;
SELECT DISTINCT category FROM products;

# Exit
\q
```

---

## Performance Tips

1. **Clear Browser Cache**
   - If pages don't update, hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Monitor Network**
   - Open DevTools (F12) → Network tab
   - Monitor API calls
   - Check response times

3. **Database Performance**
   - Seed script creates indexes automatically
   - See `database/schema.sql` for indexes

4. **Frontend Performance**
   - Vite provides hot module replacement
   - Changes save instantly
   - No need to restart dev server

---

## Next Steps After Setup

1. **Customize Styling**
   - Edit CSS files in `frontend/src/styles/`
   - Change colors, fonts, spacing

2. **Add More Products**
   - Edit `backend/database/seed.js`
   - Run `npm run seed` again

3. **Add New Features**
   - User authentication
   - Product reviews
   - Wishlist
   - Order tracking

4. **Deploy Application**
   - See [Deployment Guide](DEPLOYMENT.md)

---

## Getting Help

1. Check console logs (Ctrl+Shift+J in browser)
2. Check backend terminal for errors
3. Review API responses in Network tab
4. Check database with `\d` commands
5. Refer to main README.md for API documentation

---

**Setup complete? Go to QUICKSTART.md for next steps! 🚀**

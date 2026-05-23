import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/auth.js';
import wishlistRoutes from './routes/wishlist.js';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const insecureJwtSecrets = new Set([
  '',
  'dev-only-change-this-secret',
  'replace-with-a-long-random-secret',
]);

if (isProduction) {
  if (insecureJwtSecrets.has(process.env.JWT_SECRET || '')) {
    console.error('FATAL: Set a strong JWT_SECRET environment variable before deploying.');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
    console.error('FATAL: Set DATABASE_URL or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME for production.');
    process.exit(1);
  }

  if (!process.env.CORS_ORIGIN) {
    console.warn('WARNING: CORS_ORIGIN is not set. The API will accept requests from any origin.');
  }
}

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.length === 0) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (isProduction) {
      try {
        const { hostname } = new URL(origin);
        if (hostname.endsWith('.vercel.app')) {
          return callback(null, true);
        }
      } catch {
        // ignore invalid origin URLs
      }
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

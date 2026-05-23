import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const imageUpdates = [
  ['Samsung Galaxy S24 Ultra', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
  ['iPhone 15 Pro Max', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
  ['OnePlus 12', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500'],
  ['Men Cotton T-Shirt', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
  ['Casual Denim Jeans', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
  ['Women Tops Collection', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500'],
  ['Sony WH-1000XM5 Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
  ['MacBook Pro 14" M3', 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=500'],
  ['Dell XPS 13 Laptop', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'],
  ['Organic Basmati Rice', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'],
  ['Extra Virgin Olive Oil', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'],
  ['Almond Butter', 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=500']
];

async function updateProductImages() {
  try {
    let updatedCount = 0;

    for (const [name, imageUrl] of imageUpdates) {
      const result = await pool.query(
        'UPDATE products SET image_url = $1, updated_at = CURRENT_TIMESTAMP WHERE name = $2',
        [imageUrl, name]
      );
      updatedCount += result.rowCount;
    }

    console.log(`Updated ${updatedCount} product image URLs`);
  } catch (error) {
    console.error('Error updating product images:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

updateProductImages();

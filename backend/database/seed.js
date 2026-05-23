import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Latest flagship smartphone with advanced camera system',
    category: 'mobiles',
    price: 129999,
    original_price: 149999,
    discount_percentage: 13,
    rating: 4.7,
    reviews_count: 2341,
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    specifications: JSON.stringify({
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '256GB',
      display: '6.8 inch AMOLED',
      battery: '5000mAh'
    })
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'Apple flagship with A17 Pro chip',
    category: 'mobiles',
    price: 139999,
    original_price: 159999,
    discount_percentage: 12,
    rating: 4.8,
    reviews_count: 1890,
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    specifications: JSON.stringify({
      processor: 'A17 Pro',
      ram: '8GB',
      storage: '256GB',
      display: '6.7 inch',
      battery: '4323mAh'
    })
  },
  {
    name: 'OnePlus 12',
    description: 'Performance powerhouse with 150W charging',
    category: 'mobiles',
    price: 64999,
    original_price: 79999,
    discount_percentage: 19,
    rating: 4.5,
    reviews_count: 1234,
    stock: 60,
    image_url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500',
    specifications: JSON.stringify({
      processor: 'Snapdragon 8 Gen 3 Leading',
      ram: '12GB',
      storage: '256GB',
      display: '6.7 inch AMOLED',
      battery: '5400mAh'
    })
  },
  {
    name: 'Men Cotton T-Shirt',
    description: 'Premium quality cotton t-shirt for everyday wear',
    category: 'fashion',
    price: 599,
    original_price: 999,
    discount_percentage: 40,
    rating: 4.2,
    reviews_count: 3456,
    stock: 200,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    specifications: JSON.stringify({
      material: '100% Cotton',
      sizes: 'S, M, L, XL, XXL',
      colors: 'Black, White, Blue'
    })
  },
  {
    name: 'Casual Denim Jeans',
    description: 'Comfortable and stylish blue denim jeans',
    category: 'fashion',
    price: 1299,
    original_price: 1999,
    discount_percentage: 35,
    rating: 4.4,
    reviews_count: 2890,
    stock: 150,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    specifications: JSON.stringify({
      material: 'Denim',
      sizes: '28-40',
      colors: 'Blue, Black'
    })
  },
  {
    name: 'Women Tops Collection',
    description: 'Stylish and comfortable women tops',
    category: 'fashion',
    price: 799,
    original_price: 1299,
    discount_percentage: 38,
    rating: 4.3,
    reviews_count: 1567,
    stock: 120,
    image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500',
    specifications: JSON.stringify({
      material: 'Cotton Blend',
      sizes: 'XS, S, M, L, XL'
    })
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Premium noise-cancelling wireless headphones',
    category: 'electronics',
    price: 27999,
    original_price: 34999,
    discount_percentage: 20,
    rating: 4.6,
    reviews_count: 1456,
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    specifications: JSON.stringify({
      type: 'Over-ear',
      driver: '40mm',
      battery: '30 hours',
      connectivity: 'Bluetooth 5.3'
    })
  },
  {
    name: 'MacBook Pro 14" M3',
    description: 'Powerful laptop for professionals',
    category: 'electronics',
    price: 139999,
    original_price: 169999,
    discount_percentage: 18,
    rating: 4.7,
    reviews_count: 987,
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=500',
    specifications: JSON.stringify({
      processor: 'M3 Max',
      ram: '16GB',
      storage: '512GB',
      display: '14.2 inch Liquid Retina'
    })
  },
  {
    name: 'Dell XPS 13 Laptop',
    description: 'Ultrabook with Intel Core i7',
    category: 'electronics',
    price: 89999,
    original_price: 109999,
    discount_percentage: 18,
    rating: 4.5,
    reviews_count: 654,
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    specifications: JSON.stringify({
      processor: 'Intel Core i7',
      ram: '16GB',
      storage: '512GB',
      display: '13.4 inch FHD'
    })
  },
  {
    name: 'Organic Basmati Rice',
    description: 'Premium long grain organic basmati rice - 5kg',
    category: 'grocery',
    price: 899,
    original_price: 1199,
    discount_percentage: 25,
    rating: 4.5,
    reviews_count: 2134,
    stock: 500,
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    specifications: JSON.stringify({
      weight: '5kg',
      type: 'Basmati',
      organic: 'Yes'
    })
  },
  {
    name: 'Extra Virgin Olive Oil',
    description: 'Cold pressed extra virgin olive oil - 500ml',
    category: 'grocery',
    price: 599,
    original_price: 799,
    discount_percentage: 25,
    rating: 4.6,
    reviews_count: 1456,
    stock: 300,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
    specifications: JSON.stringify({
      volume: '500ml',
      type: 'Extra Virgin',
      origin: 'Spain'
    })
  },
  {
    name: 'Almond Butter',
    description: 'Natural almond butter - 500g',
    category: 'grocery',
    price: 449,
    original_price: 599,
    discount_percentage: 25,
    rating: 4.4,
    reviews_count: 987,
    stock: 250,
    image_url: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=500',
    specifications: JSON.stringify({
      weight: '500g',
      type: 'Natural',
      organic: 'Yes'
    })
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await pool.query('DELETE FROM order_items;');
    await pool.query('DELETE FROM orders;');
    await pool.query('DELETE FROM cart_items;');
    await pool.query('DELETE FROM products;');
    
    console.log('Cleared existing data...');
    
    // Insert products
    for (const product of products) {
      await pool.query(
        `INSERT INTO products (
          name, description, category, price, original_price, 
          discount_percentage, rating, reviews_count, stock, 
          image_url, specifications
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          product.name,
          product.description,
          product.category,
          product.price,
          product.original_price,
          product.discount_percentage,
          product.rating,
          product.reviews_count,
          product.stock,
          product.image_url,
          product.specifications
        ]
      );
    }
    
    console.log(`Successfully seeded ${products.length} products`);
    await pool.end();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

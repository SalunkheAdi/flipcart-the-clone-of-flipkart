import pool from '../config/database.js';

export async function getAllProducts(req, res) {
  try {
    const { category, search, minPrice, maxPrice, sort = 'price', order = 'asc' } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    let params = [];

    if (category) {
      query += ' AND category = $' + (params.length + 1);
      params.push(category);
    }

    if (search) {
      query += ' AND (LOWER(name) LIKE LOWER($' + (params.length + 1) + ') OR LOWER(description) LIKE LOWER($' + (params.length + 2) + '))';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice !== undefined && minPrice !== '') {
      query += ' AND price >= $' + (params.length + 1);
      params.push(Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      query += ' AND price <= $' + (params.length + 1);
      params.push(Number(maxPrice));
    }

    if (sort === 'price') {
      query += ` ORDER BY price ${order.toUpperCase()}`;
    } else if (sort === 'rating') {
      query += ` ORDER BY rating ${order.toUpperCase()}`;
    } else if (sort === 'newest') {
      query += ` ORDER BY created_at ${order.toUpperCase()}`;
    }

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Error fetching product' });
  }
}

export async function searchProducts(req, res) {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const result = await pool.query(
      `SELECT id, name, image_url, price, rating FROM products 
       WHERE LOWER(name) LIKE LOWER($1) LIMIT 10`,
      [`%${query}%`]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, message: 'Error searching products' });
  }
}

export async function getCategories(req, res) {
  try {
    const result = await pool.query(
      'SELECT DISTINCT category FROM products ORDER BY category'
    );

    res.json({ 
      success: true, 
      data: result.rows.map(row => row.category) 
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
}

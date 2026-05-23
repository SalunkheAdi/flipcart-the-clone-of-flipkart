import express from 'express';
import pool from '../config/database.js';
import { verifyToken } from './auth.js';

const router = express.Router();

const serverError = (res, message, error) => {
  console.error(message, error);
  res.status(500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
  });
};

router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.* FROM products p
       INNER JOIN wishlist w ON p.id = w.product_id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    serverError(res, 'Error fetching wishlist', error);
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const result = await pool.query(
      `INSERT INTO wishlist (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING
       RETURNING *`,
      [req.user.id, productId]
    );

    res.json({
      success: true,
      message: 'Added to wishlist',
      data: result.rows[0],
    });
  } catch (error) {
    serverError(res, 'Error adding to wishlist', error);
  }
});

router.delete('/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;

    await pool.query(
      'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );

    res.json({
      success: true,
      message: 'Removed from wishlist',
    });
  } catch (error) {
    serverError(res, 'Error removing from wishlist', error);
  }
});

router.get('/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      'SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );

    res.json({
      success: true,
      inWishlist: result.rows.length > 0,
    });
  } catch (error) {
    serverError(res, 'Error checking wishlist', error);
  }
});

export default router;

import pool from '../config/database.js';

export async function getCart(req, res) {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID required' });
    }

    const result = await pool.query(
      `SELECT 
        c.id, c.product_id, c.quantity, 
        p.name, p.price, p.image_url, p.original_price, 
        p.discount_percentage, p.stock
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.session_id = $1`,
      [sessionId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart' });
  }
}

export async function addToCart(req, res) {
  try {
    const { productId, sessionId, quantity = 1 } = req.body;

    if (!productId || !sessionId) {
      return res.status(400).json({ success: false, message: 'Product ID and Session ID required' });
    }

    // Check if product exists
    const productCheck = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if item already in cart
    const cartCheck = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE product_id = $1 AND session_id = $2',
      [productId, sessionId]
    );

    let result;
    if (cartCheck.rows.length > 0) {
      // Update quantity
      const newQuantity = cartCheck.rows[0].quantity + quantity;
      result = await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
        [newQuantity, cartCheck.rows[0].id]
      );
    } else {
      // Insert new item
      result = await pool.query(
        'INSERT INTO cart_items (product_id, session_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [productId, sessionId, quantity]
      );
    }

    res.json({ success: true, data: result.rows[0], message: 'Added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Error adding to cart' });
  }
}

export async function updateCartItem(req, res) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    if (quantity === 0) {
      await pool.query('DELETE FROM cart_items WHERE id = $1', [id]);
      return res.json({ success: true, message: 'Item removed from cart' });
    }

    const result = await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, message: 'Error updating cart' });
  }
}

export async function removeFromCart(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM cart_items WHERE id = $1', [id]);

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: 'Error removing from cart' });
  }
}

export async function clearCart(req, res) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID required' });
    }

    await pool.query('DELETE FROM cart_items WHERE session_id = $1', [sessionId]);

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, message: 'Error clearing cart' });
  }
}

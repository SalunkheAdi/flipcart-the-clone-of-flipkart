import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export async function createOrder(req, res) {
  try {
    const {
      customerName,
      customerPhone,
      shippingAddress,
      city,
      postalCode,
      state,
      cartItems,
      totalAmount
    } = req.body;
    const customerEmail = req.user?.email;

    if (!customerName || !customerEmail || !shippingAddress || !cartItems || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const orderId = `FLP${Date.now()}${uuidv4().slice(0, 8).toUpperCase()}`;

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert order
      const orderResult = await client.query(
        `INSERT INTO orders (
          order_id, customer_name, customer_email, customer_phone,
          shipping_address, city, postal_code, state, total_amount, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id`,
        [
          orderId,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          city,
          postalCode,
          state,
          totalAmount,
          'pending'
        ]
      );

      const orderDBId = orderResult.rows[0].id;

      // Insert order items
      for (const item of cartItems) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderDBId, item.product_id, item.quantity, item.price]
        );
      }

      // Clear cart
      await client.query('DELETE FROM cart_items WHERE session_id = $1', [req.body.sessionId]);

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        data: {
          orderId,
          orderDBId,
          customerName,
          customerEmail,
          totalAmount
        },
        message: 'Order created successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Error creating order' });
  }
}

export async function getOrder(req, res) {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      'SELECT * FROM orders WHERE order_id = $1 OR id = $1',
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = result.rows[0];

    // Get order items
    const itemsResult = await pool.query(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );

    res.json({
      success: true,
      data: {
        ...order,
        items: itemsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Error fetching order' });
  }
}

export async function getOrdersByEmail(req, res) {
  try {
    const email = req.user?.email;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const result = await pool.query(
      'SELECT * FROM orders WHERE customer_email = $1 ORDER BY created_at DESC',
      [email]
    );

    const orders = result.rows;
    const orderIds = orders.map((order) => order.id);
    let itemsByOrderId = {};

    if (orderIds.length > 0) {
      const itemsResult = await pool.query(
        `SELECT oi.*, p.name AS product_name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ANY($1::int[])
         ORDER BY oi.id`,
        [orderIds]
      );

      itemsByOrderId = itemsResult.rows.reduce((groups, item) => {
        groups[item.order_id] = groups[item.order_id] || [];
        groups[item.order_id].push(item);
        return groups;
      }, {});
    }

    res.json({
      success: true,
      data: orders.map((order) => ({
        ...order,
        items: itemsByOrderId[order.id] || []
      }))
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *',
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Error updating order' });
  }
}

import express from 'express';
import {
  createOrder,
  getOrder,
  getOrdersByEmail,
  updateOrderStatus
} from '../controllers/orderController.js';
import { verifyToken } from './auth.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.get('/by-email', verifyToken, getOrdersByEmail);
router.get('/:orderId', getOrder);
router.put('/:orderId', verifyToken, updateOrderStatus);

export default router;

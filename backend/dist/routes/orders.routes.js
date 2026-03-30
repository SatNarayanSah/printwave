// src/routes/orders.routes.ts
import { Router } from 'express';
import * as orderController from '../controllers/orders.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import * as orderValidator from '../validators/order.validator.js';
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and checkout
 */
router.use(authenticate);
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId: { type: string, format: uuid }
 *               notes: { type: string }
 */
router.post('/', validate(orderValidator.createOrderSchema), orderController.createOrder);
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get my orders
 *     tags: [Orders]
 */
router.get('/', orderController.getMyOrders);
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Order detail
 *     tags: [Orders]
 */
router.get('/:id', orderController.getOrderDetail);
/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   post:
 *     summary: Cancel order
 *     tags: [Orders]
 */
router.post('/:id/cancel', orderController.cancelOrder);
export default router;

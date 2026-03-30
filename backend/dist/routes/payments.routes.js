// src/routes/payments.routes.ts
import { Router } from 'express';
import * as paymentController from '../controllers/payments.controller.js';
import { authenticate } from '../middleware/authenticate.js';
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: eSewa and Khalti integration
 */
router.use(authenticate);
/**
 * @swagger
 * /api/payments/esewa/initiate:
 *   post:
 *     summary: Generate eSewa payment form data
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId: { type: string, format: uuid }
 */
router.post('/esewa/initiate', paymentController.initiateESewa);
/**
 * @swagger
 * /api/payments/esewa/verify:
 *   post:
 *     summary: Verify eSewa payment
 *     tags: [Payments]
 */
router.post('/esewa/verify', paymentController.verifyESewa);
export default router;

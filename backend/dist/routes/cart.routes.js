// src/routes/cart.routes.ts
import { Router } from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import * as cartValidator from '../validators/cart.validator.js';
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */
router.use(authenticate);
/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', cartController.getCart);
/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId: { type: string, format: uuid }
 *               variantId: { type: string, format: uuid }
 *               quantity: { type: integer, minimum: 1 }
 */
router.post('/items', validate(cartValidator.addToCartSchema), cartController.addItem);
/**
 * @swagger
 * /api/cart/items/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.put('/items/:id', validate(cartValidator.updateCartItemSchema), cartController.updateItem);
/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 */
router.delete('/items/:id', cartController.removeItem);
/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 */
router.delete('/', cartController.clearCart);
export default router;

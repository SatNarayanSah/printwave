// src/routes/reviews.routes.ts
import { Router } from 'express';
import * as reviewController from '../controllers/reviews.controller.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product reviews and ratings
 */

/**
 * @swagger
 * /api/reviews/{productId}:
 *   get:
 *     summary: Get public reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.get('/:productId', reviewController.getProductReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Add product review
 *     tags: [Reviews]
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
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               title: { type: string }
 *               body: { type: string }
 */
router.post('/', authenticate, reviewController.addReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: "[ADMIN] Hide review"
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, authorize('ADMIN'), reviewController.hideReview);

export default router;

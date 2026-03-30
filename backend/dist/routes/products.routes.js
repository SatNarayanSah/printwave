// src/routes/products.routes.ts
import { Router } from 'express';
import { getProducts, getProductBySlug } from '../controllers/products.controller.js';
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog management
 */
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List products with filters and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 */
router.get('/', getProducts);
/**
 * @swagger
 * /api/products/{slug}:
 *   get:
 *     summary: Get single product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 */
router.get('/:slug', getProductBySlug);
// [ADMIN] routes would go here with authenticate / authorize middleware
// router.post('/', authenticate, authorize('ADMIN'), createProduct);
export default router;

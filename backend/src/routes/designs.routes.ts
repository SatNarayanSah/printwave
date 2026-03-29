// src/routes/designs.routes.ts
import { Router } from 'express';
import * as designController from '../controllers/designs.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/upload.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Designs
 *   description: Custom artwork management
 */

router.use(authenticate);

/**
 * @swagger
 * /api/designs:
 *   post:
 *     summary: Upload custom design file
 *     tags: [Designs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 *               name: { type: string }
 */
router.post('/', upload.single('file'), designController.uploadDesign);

/**
 * @swagger
 * /api/designs:
 *   get:
 *     summary: Get my uploaded designs
 *     tags: [Designs]
 */
router.get('/', designController.getMyDesigns);

/**
 * @swagger
 * /api/designs/{id}:
 *   delete:
 *     summary: Delete own design
 *     tags: [Designs]
 */
router.delete('/:id', designController.deleteDesign);

export default router;

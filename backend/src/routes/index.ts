// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './products.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './orders.routes.js';
import designRoutes from './designs.routes.js';
import paymentRoutes from './payments.routes.js';
import reviewRoutes from './reviews.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/designs', designRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);

export default router;

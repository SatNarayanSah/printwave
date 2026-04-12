// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './categories.routes.js';
import productRoutes from './products.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './orders.routes.js';
import designRoutes from './designs.routes.js';
import paymentRoutes from './payments.routes.js';
import reviewRoutes from './reviews.routes.js';
import addressRoutes from './addresses.routes.js';

import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/designs', designRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/addresses', addressRoutes);

export default router;

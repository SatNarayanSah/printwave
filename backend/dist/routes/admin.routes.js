import { Router } from 'express';
import { getDashboardStats, getAdminProducts, createProduct, updateProduct, deleteProduct, getAdminOrders, updateOrderStatus, getAdminDesigns } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/authenticate.js';
const router = Router();
// All routes require ADMIN access
router.use(authenticate, authorize('ADMIN'));
router.get('/dashboard', getDashboardStats);
router.get('/products', getAdminProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/designs', getAdminDesigns);
export default router;

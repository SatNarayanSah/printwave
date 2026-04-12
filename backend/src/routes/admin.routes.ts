import { Router } from 'express';
import { 
    getDashboardStats, 
    getAdminProducts, createProduct, updateProduct, deleteProduct,
    getAdminOrders, updateOrderStatus,
    getAdminDesigns,
    createDesignerAccount,
    getAdminUsers,
    updateUserRole,
    updateUserStatus,
    updateDesignStatus
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createDesignerSchema } from '../validators/admin.validator.js';

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
router.put('/designs/:id/status', updateDesignStatus);
router.post('/designers', validate(createDesignerSchema), createDesignerAccount);

router.get('/users', getAdminUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);

export default router;

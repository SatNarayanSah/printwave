import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authenticate.js';
import {
  getDesignerDashboard,
  getDesignerDesigns,
  getDesignerOrders,
  getDesignerProfile,
  updateDesignerProfile,
} from '../controllers/designer.controller.js';
import { upload } from '../middleware/upload.js';
import { uploadDesign, deleteDesign } from '../controllers/designs.controller.js';

const router = Router();

// All routes require DESIGNER (or ADMIN) access
router.use(authenticate, authorize('DESIGNER', 'ADMIN'));

router.get('/dashboard', getDesignerDashboard);
router.get('/designs', getDesignerDesigns);
router.post('/designs', upload.single('file'), uploadDesign);
router.delete('/designs/:id', deleteDesign);
router.get('/orders', getDesignerOrders);
router.get('/profile', getDesignerProfile);
router.put('/profile', updateDesignerProfile);

export default router;

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createAddressSchema } from '../validators/address.validator.js';
import { createAddress, deleteAddress, getMyAddresses } from '../controllers/addresses.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', getMyAddresses);
router.post('/', validate(createAddressSchema), createAddress);
router.delete('/:id', deleteAddress);

export default router;


import { Router } from 'express';
import * as accessoryController from '../controllers/accessoryController.js';

/**
 * Accessory routes - maps REST endpoints to controller functions.
 * Replaces SOAP endpoint routing for accessory operations.
 */
const router = Router();

router.get('/', accessoryController.getAllAccessories);
router.post('/', accessoryController.addAccessory);
router.put('/:id', accessoryController.updateAccessory);
router.delete('/:id', accessoryController.deleteAccessory);

export default router;

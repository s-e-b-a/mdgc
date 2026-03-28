import { Router } from 'express';
import * as platformController from '../controllers/platformController.js';

/**
 * Platform routes - maps REST endpoints to controller functions.
 * Replaces SOAP endpoint routing from sun-jaxws.xml.
 */
const router = Router();

router.get('/', platformController.getAllPlatforms);
router.post('/', platformController.addPlatform);
router.put('/:id', platformController.updatePlatform);
router.delete('/:id', platformController.deletePlatform);

export default router;

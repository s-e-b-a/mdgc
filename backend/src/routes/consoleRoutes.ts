import { Router } from 'express';
import * as consoleController from '../controllers/consoleController.js';

/**
 * Console routes - maps REST endpoints to controller functions.
 * Replaces SOAP endpoint routing for console operations.
 */
const router = Router();

router.get('/', consoleController.getAllConsoles);
router.post('/', consoleController.addConsole);
router.put('/:id', consoleController.updateConsole);
router.delete('/:id', consoleController.deleteConsole);

export default router;

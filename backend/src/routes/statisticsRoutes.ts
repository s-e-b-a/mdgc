import { Router } from 'express';
import * as statisticsController from '../controllers/statisticsController.js';

/**
 * Statistics routes - maps REST endpoints to controller functions.
 * Replaces SOAP endpoint routing for ping and statistics operations.
 */
const router = Router();

router.get('/ping', statisticsController.ping);
router.get('/statistics', statisticsController.getStatisticsReport);

export default router;

import { Router } from 'express';
import * as videoGameController from '../controllers/videoGameController.js';

/**
 * VideoGame routes - maps REST endpoints to controller functions.
 * Replaces SOAP endpoint routing for video game operations.
 */
const router = Router();

router.get('/collection-value', videoGameController.getTotalCollectionValue);
router.get('/', videoGameController.getAllVideoGames);
router.post('/', videoGameController.addVideoGame);
router.put('/:id', videoGameController.updateVideoGame);
router.delete('/:id', videoGameController.deleteVideoGame);

export default router;

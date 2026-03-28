import express from 'express';
import platformRoutes from './routes/platformRoutes.js';
import videoGameRoutes from './routes/videoGameRoutes.js';
import consoleRoutes from './routes/consoleRoutes.js';
import accessoryRoutes from './routes/accessoryRoutes.js';
import statisticsRoutes from './routes/statisticsRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

/**
 * Express application setup.
 * Configures JSON body parsing, registers route handlers, and error middleware.
 */
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api/platforms', platformRoutes);
app.use('/api/videogames', videoGameRoutes);
app.use('/api/consoles', consoleRoutes);
app.use('/api/accessories', accessoryRoutes);
app.use('/api', statisticsRoutes);

// Error handling middleware (must be registered last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

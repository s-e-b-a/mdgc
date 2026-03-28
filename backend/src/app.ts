import express from 'express';
import platformRoutes from './routes/platformRoutes.js';
import videoGameRoutes from './routes/videoGameRoutes.js';
import consoleRoutes from './routes/consoleRoutes.js';

/**
 * Express application setup.
 * Configures JSON body parsing and registers route handlers.
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

export default app;

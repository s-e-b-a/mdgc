import express from 'express';

/**
 * Express application setup.
 * Configures JSON body parsing and exports the app for testing.
 */
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

export default app;

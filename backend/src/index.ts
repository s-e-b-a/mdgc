import app from './app.js';
import { serverConfig } from './config/database.js';

/**
 * Start the Express server on the configured port.
 */
const PORT = serverConfig.port;

app.listen(PORT, () => {
  console.log(`Inventory API server running on port ${PORT}`);
});

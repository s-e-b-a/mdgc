import type { Request, Response } from 'express';
import * as statisticsService from '../services/statisticsService.js';

/**
 * Statistics controller - handles HTTP requests for statistics and ping operations.
 * Maps SOAP operations to REST endpoints.
 */

/**
 * GET /api/ping - Health check / ping endpoint
 * Equivalent to Java: ping() SOAP operation
 * Returns: { message: 'Pong from Inventory Service!' }
 */
export async function ping(req: Request, res: Response): Promise<void> {
  res.json({ message: 'Pong from Inventory Service!' });
}

/**
 * GET /api/statistics - Get statistics report
 * Equivalent to Java: getStatisticsReport() SOAP operation
 * Returns structured JSON instead of the original formatted string.
 */
export async function getStatisticsReport(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const report = await statisticsService.getStatisticsReport();
    res.json(report);
  } catch (error) {
    console.error('Error generating statistics report:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error generating stats.',
    });
  }
}

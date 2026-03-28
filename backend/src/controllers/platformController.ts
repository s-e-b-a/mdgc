import type { Request, Response } from 'express';
import * as platformService from '../services/platformService.js';

/**
 * Platform controller - handles HTTP requests for platform CRUD operations.
 * Maps SOAP operations to REST endpoints.
 */

/**
 * GET / - Get all platforms
 * Equivalent to Java: getAllPlatforms() SOAP operation
 */
export async function getAllPlatforms(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const platforms = await platformService.getAllPlatforms();
    res.json(platforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch platforms',
    });
  }
}

/**
 * POST / - Add a new platform
 * Equivalent to Java: addPlatform(Platform) SOAP operation
 */
export async function addPlatform(req: Request, res: Response): Promise<void> {
  try {
    const platform = await platformService.addPlatform(req.body);
    res.status(201).json(platform);
  } catch (error) {
    console.error('Error adding platform:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add platform',
    });
  }
}

/**
 * PUT /:id - Update a platform
 * Equivalent to Java: updatePlatform(Platform) SOAP operation
 */
export async function updatePlatform(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    const platform = await platformService.updatePlatform(id, req.body);
    res.status(200).json(platform);
  } catch (error) {
    console.error('Error updating platform:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update platform',
    });
  }
}

/**
 * DELETE /:id - Delete a platform
 * Equivalent to Java: deletePlatform(int) SOAP operation
 */
export async function deletePlatform(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    await platformService.deletePlatform(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting platform:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete platform',
    });
  }
}

import type { Request, Response } from 'express';
import * as accessoryService from '../services/accessoryService.js';

/**
 * Accessory controller - handles HTTP requests for accessory CRUD operations.
 * Maps SOAP operations to REST endpoints.
 */

/**
 * GET / - Get all accessories
 * Equivalent to Java: getAllAccessories() SOAP operation
 */
export async function getAllAccessories(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const accessories = await accessoryService.getAllAccessories();
    res.json(accessories);
  } catch (error) {
    console.error('Error fetching accessories:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch accessories',
    });
  }
}

/**
 * POST / - Add a new accessory
 * Equivalent to Java: addAccessory(Accessory) SOAP operation
 */
export async function addAccessory(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const accessory = await accessoryService.addAccessory(req.body);
    res.status(201).json(accessory);
  } catch (error) {
    console.error('Error adding accessory:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add accessory',
    });
  }
}

/**
 * PUT /:id - Update an accessory
 * Equivalent to Java: updateAccessory(Accessory) SOAP operation
 */
export async function updateAccessory(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    const accessory = await accessoryService.updateAccessory(id, req.body);
    res.status(200).json(accessory);
  } catch (error) {
    console.error('Error updating accessory:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update accessory',
    });
  }
}

/**
 * DELETE /:id - Delete an accessory
 * Equivalent to Java: deleteAccessory(int) SOAP operation
 */
export async function deleteAccessory(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    await accessoryService.deleteAccessory(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting accessory:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete accessory',
    });
  }
}

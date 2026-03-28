import type { Request, Response } from 'express';
import * as consoleService from '../services/consoleService.js';

/**
 * Console controller - handles HTTP requests for console CRUD operations.
 * Maps SOAP operations to REST endpoints.
 */

/**
 * GET / - Get all consoles
 * Equivalent to Java: getAllConsoles() SOAP operation
 */
export async function getAllConsoles(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const consoles = await consoleService.getAllConsoles();
    res.json(consoles);
  } catch (error) {
    console.error('Error fetching consoles:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch consoles',
    });
  }
}

/**
 * POST / - Add a new console
 * Equivalent to Java: addConsole(Console) SOAP operation
 */
export async function addConsole(req: Request, res: Response): Promise<void> {
  try {
    const consoleItem = await consoleService.addConsole(req.body);
    res.status(201).json(consoleItem);
  } catch (error) {
    console.error('Error adding console:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add console',
    });
  }
}

/**
 * PUT /:id - Update a console
 * Equivalent to Java: updateConsole(Console) SOAP operation
 */
export async function updateConsole(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    const consoleItem = await consoleService.updateConsole(id, req.body);
    res.status(200).json(consoleItem);
  } catch (error) {
    console.error('Error updating console:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update console',
    });
  }
}

/**
 * DELETE /:id - Delete a console
 * Equivalent to Java: deleteConsole(int) SOAP operation
 */
export async function deleteConsole(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    await consoleService.deleteConsole(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting console:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete console',
    });
  }
}

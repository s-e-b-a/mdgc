import type { Request, Response } from 'express';
import * as videoGameService from '../services/videoGameService.js';

/**
 * VideoGame controller - handles HTTP requests for video game CRUD operations.
 * Maps SOAP operations to REST endpoints.
 */

/**
 * GET / - Get all video games
 * Equivalent to Java: getAllVideoGames() SOAP operation
 */
export async function getAllVideoGames(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const games = await videoGameService.getAllVideoGames();
    res.json(games);
  } catch (error) {
    console.error('Error fetching video games:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch video games',
    });
  }
}

/**
 * POST / - Add a new video game
 * Equivalent to Java: addVideoGame(VideoGame) SOAP operation
 */
export async function addVideoGame(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const game = await videoGameService.addVideoGame(req.body);
    res.status(201).json(game);
  } catch (error) {
    console.error('Error adding video game:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add video game',
    });
  }
}

/**
 * PUT /:id - Update a video game
 * Equivalent to Java: updateVideoGame(VideoGame) SOAP operation
 */
export async function updateVideoGame(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    const game = await videoGameService.updateVideoGame(id, req.body);
    res.status(200).json(game);
  } catch (error) {
    console.error('Error updating video game:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update video game',
    });
  }
}

/**
 * DELETE /:id - Delete a video game
 * Equivalent to Java: deleteVideoGame(int) SOAP operation
 */
export async function deleteVideoGame(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    await videoGameService.deleteVideoGame(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting video game:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete video game',
    });
  }
}

/**
 * GET /collection-value - Get total collection value
 * Equivalent to Java: getTotalCollectionValue() SOAP operation
 */
export async function getTotalCollectionValue(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const value = await videoGameService.getTotalCollectionValue();
    res.json({ value });
  } catch (error) {
    console.error('Error getting collection value:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get collection value',
    });
  }
}

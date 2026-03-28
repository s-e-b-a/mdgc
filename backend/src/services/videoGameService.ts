import { PrismaClient } from '@prisma/client';
import type { IVideoGame } from '../models/index.js';

const prisma = new PrismaClient();

/**
 * VideoGame service - handles CRUD operations and aggregation for video games.
 * Migrated from Java InventoryServiceImpl video game methods.
 */

/**
 * Input data type for creating/updating a video game.
 */
interface VideoGameInput {
  title: string;
  platformId: number;
  format?: string | null;
  completeness?: string | null;
  region?: string | null;
  storeOrigin?: string | null;
  purchasePrice?: number;
  acquisitionDate?: string | null;
  playState?: string | null;
}

/**
 * Get all video games with platform names.
 * Equivalent to Java: SELECT v.*, p.name as platform_name FROM videogames v LEFT JOIN platforms p ON v.platform_id = p.id
 */
export async function getAllVideoGames(): Promise<IVideoGame[]> {
  const games = await prisma.videoGame.findMany({
    include: {
      platform: true,
    },
  });

  return games.map((game) => ({
    id: game.id,
    title: game.title,
    platformId: game.platformId,
    platform: game.platform?.name ?? null,
    format: game.format,
    completeness: game.completeness,
    region: game.region,
    storeOrigin: game.storeOrigin,
    purchasePrice: game.purchasePrice,
    acquisitionDate: game.acquisitionDate
      ? game.acquisitionDate.toISOString().split('T')[0]
      : null,
    playState: game.playState,
  }));
}

/**
 * Add a new video game.
 * Handles acquisitionDate string-to-Date conversion matching Java's Date.valueOf behavior.
 * Equivalent to Java: INSERT INTO videogames (title, platform_id, ...) VALUES (?,?,...)
 */
export async function addVideoGame(data: VideoGameInput): Promise<IVideoGame> {
  const game = await prisma.videoGame.create({
    data: {
      title: data.title,
      platformId: data.platformId,
      format: data.format ?? null,
      completeness: data.completeness ?? null,
      region: data.region ?? null,
      storeOrigin: data.storeOrigin ?? null,
      purchasePrice: data.purchasePrice ?? 0,
      acquisitionDate:
        data.acquisitionDate && data.acquisitionDate.trim() !== ''
          ? new Date(data.acquisitionDate)
          : null,
      playState: data.playState ?? null,
    },
    include: {
      platform: true,
    },
  });

  return {
    id: game.id,
    title: game.title,
    platformId: game.platformId,
    platform: game.platform?.name ?? null,
    format: game.format,
    completeness: game.completeness,
    region: game.region,
    storeOrigin: game.storeOrigin,
    purchasePrice: game.purchasePrice,
    acquisitionDate: game.acquisitionDate
      ? game.acquisitionDate.toISOString().split('T')[0]
      : null,
    playState: game.playState,
  };
}

/**
 * Update a video game by id.
 * Equivalent to Java: UPDATE videogames SET title=?, platform_id=?, ... WHERE id=?
 */
export async function updateVideoGame(
  id: number,
  data: VideoGameInput
): Promise<IVideoGame> {
  const game = await prisma.videoGame.update({
    where: { id },
    data: {
      title: data.title,
      platformId: data.platformId,
      format: data.format ?? null,
      completeness: data.completeness ?? null,
      region: data.region ?? null,
      storeOrigin: data.storeOrigin ?? null,
      purchasePrice: data.purchasePrice ?? 0,
      acquisitionDate:
        data.acquisitionDate && data.acquisitionDate.trim() !== ''
          ? new Date(data.acquisitionDate)
          : null,
      playState: data.playState ?? null,
    },
    include: {
      platform: true,
    },
  });

  return {
    id: game.id,
    title: game.title,
    platformId: game.platformId,
    platform: game.platform?.name ?? null,
    format: game.format,
    completeness: game.completeness,
    region: game.region,
    storeOrigin: game.storeOrigin,
    purchasePrice: game.purchasePrice,
    acquisitionDate: game.acquisitionDate
      ? game.acquisitionDate.toISOString().split('T')[0]
      : null,
    playState: game.playState,
  };
}

/**
 * Delete a video game by id.
 * Equivalent to Java: DELETE FROM videogames WHERE id=?
 */
export async function deleteVideoGame(id: number): Promise<void> {
  await prisma.videoGame.delete({
    where: { id },
  });
}

/**
 * Get total collection value (sum of purchase prices).
 * Equivalent to Java: SELECT SUM(purchase_price) FROM videogames
 * Returns number matching Java's double return type.
 */
export async function getTotalCollectionValue(): Promise<number> {
  const result = await prisma.videoGame.aggregate({
    _sum: {
      purchasePrice: true,
    },
  });

  return result._sum.purchasePrice ?? 0;
}

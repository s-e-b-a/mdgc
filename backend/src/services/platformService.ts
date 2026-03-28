import { PrismaClient } from '@prisma/client';
import type { IPlatform } from '../models/index.js';

const prisma = new PrismaClient();

/**
 * Platform service - handles CRUD operations for platforms.
 * Migrated from Java InventoryServiceImpl platform methods.
 */

/**
 * Get all platforms.
 * Equivalent to Java: SELECT * FROM platforms
 */
export async function getAllPlatforms(): Promise<IPlatform[]> {
  const platforms = await prisma.platform.findMany();
  return platforms.map((p) => ({
    id: p.id,
    name: p.name,
  }));
}

/**
 * Add a new platform.
 * Equivalent to Java: INSERT INTO platforms (name) VALUES (?)
 */
export async function addPlatform(data: { name: string }): Promise<IPlatform> {
  const platform = await prisma.platform.create({
    data: {
      name: data.name,
    },
  });
  return {
    id: platform.id,
    name: platform.name,
  };
}

/**
 * Update a platform by id.
 * Equivalent to Java: UPDATE platforms SET name=? WHERE id=?
 */
export async function updatePlatform(
  id: number,
  data: { name: string }
): Promise<IPlatform> {
  const platform = await prisma.platform.update({
    where: { id },
    data: {
      name: data.name,
    },
  });
  return {
    id: platform.id,
    name: platform.name,
  };
}

/**
 * Delete a platform by id.
 * Equivalent to Java: DELETE FROM platforms WHERE id=?
 */
export async function deletePlatform(id: number): Promise<void> {
  await prisma.platform.delete({
    where: { id },
  });
}

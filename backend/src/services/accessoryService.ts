import { PrismaClient } from '@prisma/client';
import type { IAccessory } from '../models/index.js';

const prisma = new PrismaClient();

/**
 * Accessory service - handles CRUD operations for accessories.
 * Migrated from Java InventoryServiceImpl accessory methods.
 */

/**
 * Input data type for creating/updating an accessory.
 */
interface AccessoryInput {
  type: string;
  brand?: string | null;
  connectivity?: string | null;
}

/**
 * Get all accessories.
 * Equivalent to Java: SELECT * FROM accessories
 */
export async function getAllAccessories(): Promise<IAccessory[]> {
  const accessories = await prisma.accessory.findMany();
  return accessories.map((a) => ({
    id: a.id,
    type: a.type,
    brand: a.brand,
    connectivity: a.connectivity,
  }));
}

/**
 * Add a new accessory.
 * Equivalent to Java: INSERT INTO accessories (type, brand, connectivity) VALUES (?,?,?)
 */
export async function addAccessory(data: AccessoryInput): Promise<IAccessory> {
  const accessory = await prisma.accessory.create({
    data: {
      type: data.type,
      brand: data.brand ?? null,
      connectivity: data.connectivity ?? null,
    },
  });
  return {
    id: accessory.id,
    type: accessory.type,
    brand: accessory.brand,
    connectivity: accessory.connectivity,
  };
}

/**
 * Update an accessory by id.
 * Equivalent to Java: UPDATE accessories SET type=?, brand=?, connectivity=? WHERE id=?
 */
export async function updateAccessory(
  id: number,
  data: AccessoryInput
): Promise<IAccessory> {
  const accessory = await prisma.accessory.update({
    where: { id },
    data: {
      type: data.type,
      brand: data.brand ?? null,
      connectivity: data.connectivity ?? null,
    },
  });
  return {
    id: accessory.id,
    type: accessory.type,
    brand: accessory.brand,
    connectivity: accessory.connectivity,
  };
}

/**
 * Delete an accessory by id.
 * Equivalent to Java: DELETE FROM accessories WHERE id=?
 */
export async function deleteAccessory(id: number): Promise<void> {
  await prisma.accessory.delete({
    where: { id },
  });
}

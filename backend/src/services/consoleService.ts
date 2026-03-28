import { PrismaClient } from '@prisma/client';
import type { IConsole } from '../models/index.js';

const prisma = new PrismaClient();

/**
 * Console service - handles CRUD operations for consoles.
 * Migrated from Java InventoryServiceImpl console methods.
 */

/**
 * Input data type for creating/updating a console.
 */
interface ConsoleInput {
  model: string;
  serialNumber?: string | null;
  colorEdition?: string | null;
  status?: string | null;
  storageCapacity?: string | null;
  includedCables?: string | null;
  platformId?: number | null;
}

/**
 * Get all consoles with platform names.
 * Equivalent to Java: SELECT c.*, p.name as platform_name FROM consoles c LEFT JOIN platforms p ON c.platform_id = p.id
 */
export async function getAllConsoles(): Promise<IConsole[]> {
  const consoles = await prisma.console.findMany({
    include: {
      platform: true,
    },
  });

  return consoles.map((c) => ({
    id: c.id,
    platformId: c.platformId,
    platformName: c.platform?.name ?? null,
    model: c.model,
    serialNumber: c.serialNumber,
    colorEdition: c.colorEdition,
    status: c.status,
    storageCapacity: c.storageCapacity,
    includedCables: c.includedCables,
  }));
}

/**
 * Add a new console.
 * Handles nullable platformId matching Java's 'if platformId > 0' logic.
 * Equivalent to Java: INSERT INTO consoles (model, serial_number, ...) VALUES (?,?,...)
 */
export async function addConsole(data: ConsoleInput): Promise<IConsole> {
  const platformId =
    data.platformId && data.platformId > 0 ? data.platformId : null;

  const console = await prisma.console.create({
    data: {
      model: data.model,
      serialNumber: data.serialNumber ?? null,
      colorEdition: data.colorEdition ?? null,
      status: data.status ?? null,
      storageCapacity: data.storageCapacity ?? null,
      includedCables: data.includedCables ?? null,
      platformId,
    },
    include: {
      platform: true,
    },
  });

  return {
    id: console.id,
    platformId: console.platformId,
    platformName: console.platform?.name ?? null,
    model: console.model,
    serialNumber: console.serialNumber,
    colorEdition: console.colorEdition,
    status: console.status,
    storageCapacity: console.storageCapacity,
    includedCables: console.includedCables,
  };
}

/**
 * Update a console by id.
 * Handles nullable platformId matching Java's 'if platformId > 0' logic.
 * Equivalent to Java: UPDATE consoles SET model=?, serial_number=?, ... WHERE id=?
 */
export async function updateConsole(
  id: number,
  data: ConsoleInput
): Promise<IConsole> {
  const platformId =
    data.platformId && data.platformId > 0 ? data.platformId : null;

  const console = await prisma.console.update({
    where: { id },
    data: {
      model: data.model,
      serialNumber: data.serialNumber ?? null,
      colorEdition: data.colorEdition ?? null,
      status: data.status ?? null,
      storageCapacity: data.storageCapacity ?? null,
      includedCables: data.includedCables ?? null,
      platformId,
    },
    include: {
      platform: true,
    },
  });

  return {
    id: console.id,
    platformId: console.platformId,
    platformName: console.platform?.name ?? null,
    model: console.model,
    serialNumber: console.serialNumber,
    colorEdition: console.colorEdition,
    status: console.status,
    storageCapacity: console.storageCapacity,
    includedCables: console.includedCables,
  };
}

/**
 * Delete a console by id.
 * Equivalent to Java: DELETE FROM consoles WHERE id=?
 */
export async function deleteConsole(id: number): Promise<void> {
  await prisma.console.delete({
    where: { id },
  });
}

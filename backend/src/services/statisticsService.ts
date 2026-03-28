import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Statistics report response interface.
 * Preserves all information from the Java string report in a REST-friendly JSON format.
 */
export interface IStatisticsReport {
  totalVideoGames: number;
  totalConsoles: number;
  totalAccessories: number;
  totalCollectionValue: number;
  gamesByPlatform: Array<{ name: string; count: number }>;
  gamesByPlayState: Array<{ playState: string; count: number }>;
}

/**
 * Statistics service - handles statistics report generation.
 * Migrated from Java InventoryServiceImpl.getStatisticsReport() method.
 *
 * The Java version returned a formatted string report. This version returns
 * a structured JSON object containing all the same data points:
 * - Total counts for videogames, consoles, accessories
 * - Total collection value (SUM of purchase_price)
 * - Games grouped by platform
 * - Games grouped by play state
 */

/**
 * Get statistics report.
 * Replicates the Java statistics report logic with structured JSON output.
 *
 * Java equivalent queries:
 * - SELECT COUNT(*) FROM videogames
 * - SELECT COUNT(*) FROM consoles
 * - SELECT COUNT(*) FROM accessories
 * - SELECT SUM(purchase_price) FROM videogames
 * - SELECT p.name, COUNT(v.id) FROM videogames v JOIN platforms p ON v.platform_id=p.id GROUP BY p.name
 * - SELECT play_state, COUNT(id) FROM videogames GROUP BY play_state
 */
export async function getStatisticsReport(): Promise<IStatisticsReport> {
  // Count totals
  const [totalVideoGames, totalConsoles, totalAccessories] = await Promise.all([
    prisma.videoGame.count(),
    prisma.console.count(),
    prisma.accessory.count(),
  ]);

  // Get total collection value (SUM of purchase_price)
  const valueResult = await prisma.videoGame.aggregate({
    _sum: {
      purchasePrice: true,
    },
  });
  const totalCollectionValue = valueResult._sum.purchasePrice ?? 0;

  // Games grouped by platform
  const gamesByPlatformRaw = await prisma.videoGame.groupBy({
    by: ['platformId'],
    _count: {
      id: true,
    },
  });

  // Fetch platform names for the grouped results
  const platformIds = gamesByPlatformRaw.map((g) => g.platformId);
  const platforms = await prisma.platform.findMany({
    where: {
      id: { in: platformIds },
    },
  });
  const platformMap = new Map(platforms.map((p) => [p.id, p.name]));

  const gamesByPlatform = gamesByPlatformRaw.map((g) => ({
    name: platformMap.get(g.platformId) ?? 'Unknown',
    count: g._count.id,
  }));

  // Games grouped by play state
  const gamesByPlayStateRaw = await prisma.videoGame.groupBy({
    by: ['playState'],
    _count: {
      id: true,
    },
  });

  const gamesByPlayState = gamesByPlayStateRaw.map((g) => ({
    playState: g.playState ?? 'Unknown',
    count: g._count.id,
  }));

  return {
    totalVideoGames,
    totalConsoles,
    totalAccessories,
    totalCollectionValue,
    gamesByPlatform,
    gamesByPlayState,
  };
}

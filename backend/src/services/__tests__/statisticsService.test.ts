import { getStatisticsReport } from '../statisticsService';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockVideoGame = {
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  };

  const mockConsole = {
    count: jest.fn(),
  };

  const mockAccessory = {
    count: jest.fn(),
  };

  const mockPlatform = {
    findMany: jest.fn(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      videoGame: mockVideoGame,
      console: mockConsole,
      accessory: mockAccessory,
      platform: mockPlatform,
    })),
  };
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('StatisticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStatisticsReport', () => {
    it('should return correct statistics report structure', async () => {
      // Mock counts
      (prisma.videoGame.count as jest.Mock).mockResolvedValue(25);
      (prisma.console.count as jest.Mock).mockResolvedValue(5);
      (prisma.accessory.count as jest.Mock).mockResolvedValue(10);

      // Mock aggregate
      (prisma.videoGame.aggregate as jest.Mock).mockResolvedValue({
        _sum: { purchasePrice: 1250.50 },
      });

      // Mock groupBy for platform
      (prisma.videoGame.groupBy as jest.Mock)
        .mockResolvedValueOnce([
          { platformId: 1, _count: { id: 15 } },
          { platformId: 2, _count: { id: 10 } },
        ])
        // Mock groupBy for play state
        .mockResolvedValueOnce([
          { playState: 'Playing', _count: { id: 5 } },
          { playState: 'Completed', _count: { id: 12 } },
          { playState: 'Backlog', _count: { id: 8 } },
        ]);

      // Mock platform lookup
      (prisma.platform.findMany as jest.Mock).mockResolvedValue([
        { id: 1, name: 'PlayStation 5' },
        { id: 2, name: 'Nintendo Switch' },
      ]);

      const result = await getStatisticsReport();

      expect(result.totalVideoGames).toBe(25);
      expect(result.totalConsoles).toBe(5);
      expect(result.totalAccessories).toBe(10);
      expect(result.totalCollectionValue).toBe(1250.50);

      expect(result.gamesByPlatform).toHaveLength(2);
      expect(result.gamesByPlatform[0]).toEqual({
        name: 'PlayStation 5',
        count: 15,
      });

      expect(result.gamesByPlayState).toHaveLength(3);
      expect(result.gamesByPlayState[0]).toEqual({
        playState: 'Playing',
        count: 5,
      });
    });

    it('should handle empty database', async () => {
      (prisma.videoGame.count as jest.Mock).mockResolvedValue(0);
      (prisma.console.count as jest.Mock).mockResolvedValue(0);
      (prisma.accessory.count as jest.Mock).mockResolvedValue(0);
      (prisma.videoGame.aggregate as jest.Mock).mockResolvedValue({
        _sum: { purchasePrice: null },
      });
      (prisma.videoGame.groupBy as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      (prisma.platform.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getStatisticsReport();

      expect(result.totalVideoGames).toBe(0);
      expect(result.totalConsoles).toBe(0);
      expect(result.totalAccessories).toBe(0);
      expect(result.totalCollectionValue).toBe(0);
      expect(result.gamesByPlatform).toEqual([]);
      expect(result.gamesByPlayState).toEqual([]);
    });
  });
});

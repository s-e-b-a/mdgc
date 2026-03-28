import {
  getAllVideoGames,
  addVideoGame,
  updateVideoGame,
  deleteVideoGame,
  getTotalCollectionValue,
} from '../videoGameService';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockVideoGame = {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    aggregate: jest.fn(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      videoGame: mockVideoGame,
    })),
  };
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('VideoGameService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllVideoGames', () => {
    it('should return all video games with platform names', async () => {
      const mockGames = [
        {
          id: 1,
          title: 'The Legend of Zelda',
          platformId: 1,
          platform: { id: 1, name: 'Nintendo Switch' },
          format: 'Digital',
          completeness: 'Complete',
          region: 'NA',
          storeOrigin: 'eShop',
          purchasePrice: 59.99,
          acquisitionDate: new Date('2023-05-12'),
          playState: 'Playing',
        },
        {
          id: 2,
          title: 'God of War',
          platformId: 2,
          platform: { id: 2, name: 'PlayStation 5' },
          format: 'Physical',
          completeness: 'Complete',
          region: 'EU',
          storeOrigin: 'Amazon',
          purchasePrice: 49.99,
          acquisitionDate: null,
          playState: 'Backlog',
        },
      ];

      (prisma.videoGame.findMany as jest.Mock).mockResolvedValue(mockGames);

      const result = await getAllVideoGames();

      expect(result).toHaveLength(2);
      expect(result[0].platform).toBe('Nintendo Switch');
      expect(result[0].acquisitionDate).toBe('2023-05-12');
      expect(result[1].acquisitionDate).toBeNull();
      expect(prisma.videoGame.findMany).toHaveBeenCalledWith({
        include: { platform: true },
      });
    });
  });

  describe('addVideoGame', () => {
    it('should create a video game with acquisitionDate', async () => {
      const mockGame = {
        id: 1,
        title: 'New Game',
        platformId: 1,
        platform: { id: 1, name: 'PS5' },
        format: 'Physical',
        completeness: null,
        region: null,
        storeOrigin: null,
        purchasePrice: 59.99,
        acquisitionDate: new Date('2023-06-15'),
        playState: 'New',
      };

      (prisma.videoGame.create as jest.Mock).mockResolvedValue(mockGame);

      const result = await addVideoGame({
        title: 'New Game',
        platformId: 1,
        format: 'Physical',
        purchasePrice: 59.99,
        acquisitionDate: '2023-06-15',
        playState: 'New',
      });

      expect(result.id).toBe(1);
      expect(result.acquisitionDate).toBe('2023-06-15');
      expect(result.platform).toBe('PS5');
    });

    it('should create a video game without acquisitionDate', async () => {
      const mockGame = {
        id: 2,
        title: 'Another Game',
        platformId: 1,
        platform: { id: 1, name: 'PS5' },
        format: null,
        completeness: null,
        region: null,
        storeOrigin: null,
        purchasePrice: 0,
        acquisitionDate: null,
        playState: null,
      };

      (prisma.videoGame.create as jest.Mock).mockResolvedValue(mockGame);

      const result = await addVideoGame({
        title: 'Another Game',
        platformId: 1,
      });

      expect(result.acquisitionDate).toBeNull();
    });
  });

  describe('updateVideoGame', () => {
    it('should update a video game by id', async () => {
      const mockGame = {
        id: 1,
        title: 'Updated Game',
        platformId: 2,
        platform: { id: 2, name: 'Xbox' },
        format: 'Digital',
        completeness: 'Complete',
        region: 'NA',
        storeOrigin: 'Store',
        purchasePrice: 39.99,
        acquisitionDate: new Date('2023-01-01'),
        playState: 'Completed',
      };

      (prisma.videoGame.update as jest.Mock).mockResolvedValue(mockGame);

      const result = await updateVideoGame(1, {
        title: 'Updated Game',
        platformId: 2,
        format: 'Digital',
        completeness: 'Complete',
        region: 'NA',
        storeOrigin: 'Store',
        purchasePrice: 39.99,
        acquisitionDate: '2023-01-01',
        playState: 'Completed',
      });

      expect(result.title).toBe('Updated Game');
      expect(prisma.videoGame.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteVideoGame', () => {
    it('should delete a video game by id', async () => {
      (prisma.videoGame.delete as jest.Mock).mockResolvedValue({ id: 1 });

      await deleteVideoGame(1);

      expect(prisma.videoGame.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('getTotalCollectionValue', () => {
    it('should return aggregate sum of purchase prices', async () => {
      (prisma.videoGame.aggregate as jest.Mock).mockResolvedValue({
        _sum: { purchasePrice: 159.97 },
      });

      const result = await getTotalCollectionValue();

      expect(result).toBe(159.97);
      expect(prisma.videoGame.aggregate).toHaveBeenCalledWith({
        _sum: { purchasePrice: true },
      });
    });

    it('should return 0 when no games exist', async () => {
      (prisma.videoGame.aggregate as jest.Mock).mockResolvedValue({
        _sum: { purchasePrice: null },
      });

      const result = await getTotalCollectionValue();

      expect(result).toBe(0);
    });
  });
});

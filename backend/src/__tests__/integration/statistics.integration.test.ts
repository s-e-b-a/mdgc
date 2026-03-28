import request from 'supertest';
import app from '../../app';

/**
 * Integration tests for Statistics and Ping REST endpoints.
 * Validates request/response contracts matching the original SOAP operations.
 * Mocks Prisma to avoid requiring a live database.
 */

// Mock PrismaClient before importing modules that use it
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

describe('Statistics & Ping REST Endpoints - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/ping', () => {
    it('should return 200 and the exact ping response message', async () => {
      const response = await request(app).get('/api/ping');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty(
        'message',
        'Pong from Inventory Service!'
      );
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/ping');

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('GET /api/statistics', () => {
    it('should return 200 and a complete statistics report', async () => {
      // Mock count operations
      (prisma.videoGame.count as jest.Mock).mockResolvedValue(15);
      (prisma.console.count as jest.Mock).mockResolvedValue(5);
      (prisma.accessory.count as jest.Mock).mockResolvedValue(8);

      // Mock aggregate for total collection value
      (prisma.videoGame.aggregate as jest.Mock).mockResolvedValue({
        _sum: { purchasePrice: 899.85 },
      });

      // Mock groupBy for games by platform
      (prisma.videoGame.groupBy as jest.Mock)
        .mockResolvedValueOnce([
          { platformId: 1, _count: { id: 8 } },
          { platformId: 2, _count: { id: 7 } },
        ])
        // Mock groupBy for games by play state
        .mockResolvedValueOnce([
          { playState: 'Completed', _count: { id: 6 } },
          { playState: 'Playing', _count: { id: 4 } },
          { playState: 'Backlog', _count: { id: 5 } },
        ]);

      // Mock platform name lookup
      (prisma.platform.findMany as jest.Mock).mockResolvedValue([
        { id: 1, name: 'PlayStation 5' },
        { id: 2, name: 'Nintendo Switch' },
      ]);

      const response = await request(app).get('/api/statistics');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);

      // Validate response structure matches the statistics report contract
      expect(response.body).toHaveProperty('totalVideoGames', 15);
      expect(response.body).toHaveProperty('totalConsoles', 5);
      expect(response.body).toHaveProperty('totalAccessories', 8);
      expect(response.body).toHaveProperty('totalCollectionValue', 899.85);

      // Validate gamesByPlatform array structure
      expect(response.body).toHaveProperty('gamesByPlatform');
      expect(response.body.gamesByPlatform).toBeInstanceOf(Array);
      expect(response.body.gamesByPlatform).toHaveLength(2);
      expect(response.body.gamesByPlatform[0]).toHaveProperty('name');
      expect(response.body.gamesByPlatform[0]).toHaveProperty('count');

      // Validate gamesByPlayState array structure
      expect(response.body).toHaveProperty('gamesByPlayState');
      expect(response.body.gamesByPlayState).toBeInstanceOf(Array);
      expect(response.body.gamesByPlayState).toHaveLength(3);
      expect(response.body.gamesByPlayState[0]).toHaveProperty('playState');
      expect(response.body.gamesByPlayState[0]).toHaveProperty('count');
    });

    it('should return statistics with zero values when database is empty', async () => {
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

      const response = await request(app).get('/api/statistics');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalVideoGames', 0);
      expect(response.body).toHaveProperty('totalConsoles', 0);
      expect(response.body).toHaveProperty('totalAccessories', 0);
      expect(response.body).toHaveProperty('totalCollectionValue', 0);
      expect(response.body.gamesByPlatform).toEqual([]);
      expect(response.body.gamesByPlayState).toEqual([]);
    });

    it('should return 500 when statistics generation fails', async () => {
      (prisma.videoGame.count as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );
      (prisma.console.count as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );
      (prisma.accessory.count as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const response = await request(app).get('/api/statistics');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
      expect(response.body).toHaveProperty('message', 'Error generating stats.');
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for unmatched routes', async () => {
      const response = await request(app).get('/api/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body).toHaveProperty('message');
    });
  });
});

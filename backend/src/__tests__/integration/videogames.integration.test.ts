import request from 'supertest';
import app from '../../app';

/**
 * Integration tests for VideoGame REST endpoints.
 * Validates request/response contracts matching the original SOAP operations.
 * Mocks Prisma to avoid requiring a live database.
 */

// Mock PrismaClient before importing modules that use it
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

describe('VideoGame REST Endpoints - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/videogames', () => {
    it('should return 200 and an array of video games with platform names', async () => {
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

      const response = await request(app).get('/api/videogames');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);

      // Validate first game response structure
      const game1 = response.body[0];
      expect(game1).toHaveProperty('id', 1);
      expect(game1).toHaveProperty('title', 'The Legend of Zelda');
      expect(game1).toHaveProperty('platformId', 1);
      expect(game1).toHaveProperty('platform', 'Nintendo Switch');
      expect(game1).toHaveProperty('format', 'Digital');
      expect(game1).toHaveProperty('completeness', 'Complete');
      expect(game1).toHaveProperty('region', 'NA');
      expect(game1).toHaveProperty('storeOrigin', 'eShop');
      expect(game1).toHaveProperty('purchasePrice', 59.99);
      expect(game1).toHaveProperty('acquisitionDate', '2023-05-12');
      expect(game1).toHaveProperty('playState', 'Playing');

      // Validate null acquisitionDate handling
      const game2 = response.body[1];
      expect(game2).toHaveProperty('acquisitionDate', null);
      expect(game2).toHaveProperty('platform', 'PlayStation 5');
    });

    it('should return 200 and empty array when no games exist', async () => {
      (prisma.videoGame.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/videogames');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 500 when service throws an error', async () => {
      (prisma.videoGame.findMany as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const response = await request(app).get('/api/videogames');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/videogames', () => {
    it('should return 201 and the created video game with all fields', async () => {
      const mockGame = {
        id: 3,
        title: 'Elden Ring',
        platformId: 2,
        platform: { id: 2, name: 'PlayStation 5' },
        format: 'Physical',
        completeness: 'Complete',
        region: 'NA',
        storeOrigin: 'GameStop',
        purchasePrice: 59.99,
        acquisitionDate: new Date('2023-02-25'),
        playState: 'Completed',
      };
      (prisma.videoGame.create as jest.Mock).mockResolvedValue(mockGame);

      const response = await request(app)
        .post('/api/videogames')
        .send({
          title: 'Elden Ring',
          platformId: 2,
          format: 'Physical',
          completeness: 'Complete',
          region: 'NA',
          storeOrigin: 'GameStop',
          purchasePrice: 59.99,
          acquisitionDate: '2023-02-25',
          playState: 'Completed',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('id', 3);
      expect(response.body).toHaveProperty('title', 'Elden Ring');
      expect(response.body).toHaveProperty('platform', 'PlayStation 5');
      expect(response.body).toHaveProperty('acquisitionDate', '2023-02-25');
      expect(response.body).toHaveProperty('purchasePrice', 59.99);
    });

    it('should return 201 with null acquisitionDate when not provided', async () => {
      const mockGame = {
        id: 4,
        title: 'Minimal Game',
        platformId: 1,
        platform: { id: 1, name: 'Nintendo Switch' },
        format: null,
        completeness: null,
        region: null,
        storeOrigin: null,
        purchasePrice: 0,
        acquisitionDate: null,
        playState: null,
      };
      (prisma.videoGame.create as jest.Mock).mockResolvedValue(mockGame);

      const response = await request(app)
        .post('/api/videogames')
        .send({ title: 'Minimal Game', platformId: 1 })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('acquisitionDate', null);
      expect(response.body).toHaveProperty('purchasePrice', 0);
    });

    it('should return 500 when creation fails', async () => {
      (prisma.videoGame.create as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const response = await request(app)
        .post('/api/videogames')
        .send({ title: 'Fail Game', platformId: 1 })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('PUT /api/videogames/:id', () => {
    it('should return 200 and the updated video game', async () => {
      const mockGame = {
        id: 1,
        title: 'Updated Title',
        platformId: 2,
        platform: { id: 2, name: 'Xbox Series X' },
        format: 'Digital',
        completeness: 'Complete',
        region: 'NA',
        storeOrigin: 'Xbox Store',
        purchasePrice: 39.99,
        acquisitionDate: new Date('2023-01-01'),
        playState: 'Completed',
      };
      (prisma.videoGame.update as jest.Mock).mockResolvedValue(mockGame);

      const response = await request(app)
        .put('/api/videogames/1')
        .send({
          title: 'Updated Title',
          platformId: 2,
          format: 'Digital',
          completeness: 'Complete',
          region: 'NA',
          storeOrigin: 'Xbox Store',
          purchasePrice: 39.99,
          acquisitionDate: '2023-01-01',
          playState: 'Completed',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title', 'Updated Title');
      expect(response.body).toHaveProperty('platform', 'Xbox Series X');
    });

    it('should return 500 when update fails', async () => {
      (prisma.videoGame.update as jest.Mock).mockRejectedValue(
        new Error('Not found')
      );

      const response = await request(app)
        .put('/api/videogames/999')
        .send({ title: 'Nonexistent', platformId: 1 })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('DELETE /api/videogames/:id', () => {
    it('should return 204 with no content on successful deletion', async () => {
      (prisma.videoGame.delete as jest.Mock).mockResolvedValue({ id: 1 });

      const response = await request(app).delete('/api/videogames/1');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should return 500 when deletion fails', async () => {
      (prisma.videoGame.delete as jest.Mock).mockRejectedValue(
        new Error('Cannot delete')
      );

      const response = await request(app).delete('/api/videogames/999');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('GET /api/videogames/collection-value', () => {
    it('should return 200 and the total collection value', async () => {
      (prisma.videoGame.aggregate as jest.Mock).mockResolvedValue({
        _sum: { purchasePrice: 259.97 },
      });

      const response = await request(app).get(
        '/api/videogames/collection-value'
      );

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('value', 259.97);
    });

    it('should return 200 with value 0 when no games exist', async () => {
      (prisma.videoGame.aggregate as jest.Mock).mockResolvedValue({
        _sum: { purchasePrice: null },
      });

      const response = await request(app).get(
        '/api/videogames/collection-value'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('value', 0);
    });

    it('should return 500 when aggregation fails', async () => {
      (prisma.videoGame.aggregate as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const response = await request(app).get(
        '/api/videogames/collection-value'
      );

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });
});

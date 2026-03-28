import request from 'supertest';
import app from '../../app';

/**
 * Integration tests for Platform REST endpoints.
 * Validates request/response contracts matching the original SOAP operations.
 * Mocks Prisma to avoid requiring a live database.
 */

// Mock PrismaClient before importing modules that use it
jest.mock('@prisma/client', () => {
  const mockPlatform = {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      platform: mockPlatform,
    })),
  };
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('Platform REST Endpoints - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/platforms', () => {
    it('should return 200 and an array of platforms', async () => {
      const mockPlatforms = [
        { id: 1, name: 'PlayStation 5' },
        { id: 2, name: 'Nintendo Switch' },
      ];
      (prisma.platform.findMany as jest.Mock).mockResolvedValue(mockPlatforms);

      const response = await request(app).get('/api/platforms');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id', 1);
      expect(response.body[0]).toHaveProperty('name', 'PlayStation 5');
      expect(response.body[1]).toHaveProperty('id', 2);
      expect(response.body[1]).toHaveProperty('name', 'Nintendo Switch');
    });

    it('should return 200 and an empty array when no platforms exist', async () => {
      (prisma.platform.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/platforms');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 500 when service throws an error', async () => {
      (prisma.platform.findMany as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const response = await request(app).get('/api/platforms');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/platforms', () => {
    it('should return 201 and the created platform', async () => {
      const newPlatform = { id: 3, name: 'Xbox Series X' };
      (prisma.platform.create as jest.Mock).mockResolvedValue(newPlatform);

      const response = await request(app)
        .post('/api/platforms')
        .send({ name: 'Xbox Series X' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('id', 3);
      expect(response.body).toHaveProperty('name', 'Xbox Series X');
    });

    it('should return 500 when creation fails', async () => {
      (prisma.platform.create as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const response = await request(app)
        .post('/api/platforms')
        .send({ name: 'Bad Platform' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/platforms/:id', () => {
    it('should return 200 and the updated platform', async () => {
      const updatedPlatform = { id: 1, name: 'PlayStation 5 Pro' };
      (prisma.platform.update as jest.Mock).mockResolvedValue(updatedPlatform);

      const response = await request(app)
        .put('/api/platforms/1')
        .send({ name: 'PlayStation 5 Pro' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'PlayStation 5 Pro');
    });

    it('should return 500 when update fails', async () => {
      (prisma.platform.update as jest.Mock).mockRejectedValue(
        new Error('Not found')
      );

      const response = await request(app)
        .put('/api/platforms/999')
        .send({ name: 'Does Not Exist' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('DELETE /api/platforms/:id', () => {
    it('should return 204 with no content on successful deletion', async () => {
      (prisma.platform.delete as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Deleted',
      });

      const response = await request(app).delete('/api/platforms/1');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should return 500 when deletion fails', async () => {
      (prisma.platform.delete as jest.Mock).mockRejectedValue(
        new Error('Cannot delete')
      );

      const response = await request(app).delete('/api/platforms/999');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });
});

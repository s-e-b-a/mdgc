import request from 'supertest';
import app from '../../app';

/**
 * Integration tests for Console REST endpoints.
 * Validates request/response contracts matching the original SOAP operations.
 * Mocks Prisma to avoid requiring a live database.
 */

// Mock PrismaClient before importing modules that use it
jest.mock('@prisma/client', () => {
  const mockConsole = {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      console: mockConsole,
    })),
  };
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('Console REST Endpoints - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/consoles', () => {
    it('should return 200 and an array of consoles with platform names', async () => {
      const mockConsoles = [
        {
          id: 1,
          platformId: 1,
          platform: { id: 1, name: 'PlayStation 5' },
          model: 'PS5 Digital Edition',
          serialNumber: 'SN12345',
          colorEdition: 'White',
          status: 'Active',
          storageCapacity: '825GB',
          includedCables: 'HDMI, Power',
        },
        {
          id: 2,
          platformId: null,
          platform: null,
          model: 'Retro Console',
          serialNumber: null,
          colorEdition: null,
          status: 'Inactive',
          storageCapacity: null,
          includedCables: null,
        },
      ];
      (prisma.console.findMany as jest.Mock).mockResolvedValue(mockConsoles);

      const response = await request(app).get('/api/consoles');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);

      // Validate first console with platform
      const console1 = response.body[0];
      expect(console1).toHaveProperty('id', 1);
      expect(console1).toHaveProperty('platformId', 1);
      expect(console1).toHaveProperty('platformName', 'PlayStation 5');
      expect(console1).toHaveProperty('model', 'PS5 Digital Edition');
      expect(console1).toHaveProperty('serialNumber', 'SN12345');
      expect(console1).toHaveProperty('colorEdition', 'White');
      expect(console1).toHaveProperty('status', 'Active');
      expect(console1).toHaveProperty('storageCapacity', '825GB');
      expect(console1).toHaveProperty('includedCables', 'HDMI, Power');

      // Validate second console with null platform (LEFT JOIN behavior)
      const console2 = response.body[1];
      expect(console2).toHaveProperty('platformId', null);
      expect(console2).toHaveProperty('platformName', null);
      expect(console2).toHaveProperty('serialNumber', null);
    });

    it('should return 200 and empty array when no consoles exist', async () => {
      (prisma.console.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/consoles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 500 when service throws an error', async () => {
      (prisma.console.findMany as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const response = await request(app).get('/api/consoles');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/consoles', () => {
    it('should return 201 and the created console with platformId > 0', async () => {
      const mockConsole = {
        id: 3,
        platformId: 2,
        platform: { id: 2, name: 'Nintendo Switch' },
        model: 'Switch OLED',
        serialNumber: 'SW98765',
        colorEdition: 'Neon',
        status: 'Active',
        storageCapacity: '64GB',
        includedCables: 'HDMI, Power, Dock',
      };
      (prisma.console.create as jest.Mock).mockResolvedValue(mockConsole);

      const response = await request(app)
        .post('/api/consoles')
        .send({
          model: 'Switch OLED',
          platformId: 2,
          serialNumber: 'SW98765',
          colorEdition: 'Neon',
          status: 'Active',
          storageCapacity: '64GB',
          includedCables: 'HDMI, Power, Dock',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('id', 3);
      expect(response.body).toHaveProperty('model', 'Switch OLED');
      expect(response.body).toHaveProperty('platformName', 'Nintendo Switch');
      expect(response.body).toHaveProperty('platformId', 2);
    });

    it('should return 201 with null platformId when platformId is 0 or missing', async () => {
      const mockConsole = {
        id: 4,
        platformId: null,
        platform: null,
        model: 'Generic Console',
        serialNumber: null,
        colorEdition: null,
        status: null,
        storageCapacity: null,
        includedCables: null,
      };
      (prisma.console.create as jest.Mock).mockResolvedValue(mockConsole);

      const response = await request(app)
        .post('/api/consoles')
        .send({ model: 'Generic Console', platformId: 0 })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('platformId', null);
      expect(response.body).toHaveProperty('platformName', null);
    });

    it('should return 500 when creation fails', async () => {
      (prisma.console.create as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const response = await request(app)
        .post('/api/consoles')
        .send({ model: 'Fail Console' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('PUT /api/consoles/:id', () => {
    it('should return 200 and the updated console', async () => {
      const mockConsole = {
        id: 1,
        platformId: 1,
        platform: { id: 1, name: 'PlayStation 5' },
        model: 'PS5 Slim',
        serialNumber: 'SN-UPDATED',
        colorEdition: 'Black',
        status: 'Active',
        storageCapacity: '1TB',
        includedCables: 'HDMI 2.1, Power',
      };
      (prisma.console.update as jest.Mock).mockResolvedValue(mockConsole);

      const response = await request(app)
        .put('/api/consoles/1')
        .send({
          model: 'PS5 Slim',
          platformId: 1,
          serialNumber: 'SN-UPDATED',
          colorEdition: 'Black',
          status: 'Active',
          storageCapacity: '1TB',
          includedCables: 'HDMI 2.1, Power',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('model', 'PS5 Slim');
      expect(response.body).toHaveProperty('platformName', 'PlayStation 5');
    });

    it('should return 500 when update fails', async () => {
      (prisma.console.update as jest.Mock).mockRejectedValue(
        new Error('Not found')
      );

      const response = await request(app)
        .put('/api/consoles/999')
        .send({ model: 'Nonexistent' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('DELETE /api/consoles/:id', () => {
    it('should return 204 with no content on successful deletion', async () => {
      (prisma.console.delete as jest.Mock).mockResolvedValue({ id: 1 });

      const response = await request(app).delete('/api/consoles/1');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should return 500 when deletion fails', async () => {
      (prisma.console.delete as jest.Mock).mockRejectedValue(
        new Error('Cannot delete')
      );

      const response = await request(app).delete('/api/consoles/999');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });
});

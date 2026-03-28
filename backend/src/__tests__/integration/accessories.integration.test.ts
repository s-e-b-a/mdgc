import request from 'supertest';
import app from '../../app';

/**
 * Integration tests for Accessory REST endpoints.
 * Validates request/response contracts matching the original SOAP operations.
 * Mocks Prisma to avoid requiring a live database.
 */

// Mock PrismaClient before importing modules that use it
jest.mock('@prisma/client', () => {
  const mockAccessory = {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      accessory: mockAccessory,
    })),
  };
});

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('Accessory REST Endpoints - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/accessories', () => {
    it('should return 200 and an array of accessories', async () => {
      const mockAccessories = [
        {
          id: 1,
          type: 'Controller',
          brand: 'Sony',
          connectivity: 'Bluetooth',
        },
        {
          id: 2,
          type: 'Headset',
          brand: 'SteelSeries',
          connectivity: 'USB',
        },
      ];
      (prisma.accessory.findMany as jest.Mock).mockResolvedValue(
        mockAccessories
      );

      const response = await request(app).get('/api/accessories');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);

      // Validate response structure matches original SOAP contract fields
      const acc1 = response.body[0];
      expect(acc1).toHaveProperty('id', 1);
      expect(acc1).toHaveProperty('type', 'Controller');
      expect(acc1).toHaveProperty('brand', 'Sony');
      expect(acc1).toHaveProperty('connectivity', 'Bluetooth');

      const acc2 = response.body[1];
      expect(acc2).toHaveProperty('id', 2);
      expect(acc2).toHaveProperty('type', 'Headset');
      expect(acc2).toHaveProperty('brand', 'SteelSeries');
      expect(acc2).toHaveProperty('connectivity', 'USB');
    });

    it('should return 200 and empty array when no accessories exist', async () => {
      (prisma.accessory.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/accessories');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 500 when service throws an error', async () => {
      (prisma.accessory.findMany as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const response = await request(app).get('/api/accessories');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/accessories', () => {
    it('should return 201 and the created accessory with all fields', async () => {
      const mockAccessory = {
        id: 3,
        type: 'Memory Card',
        brand: 'Samsung',
        connectivity: 'SD',
      };
      (prisma.accessory.create as jest.Mock).mockResolvedValue(mockAccessory);

      const response = await request(app)
        .post('/api/accessories')
        .send({
          type: 'Memory Card',
          brand: 'Samsung',
          connectivity: 'SD',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('id', 3);
      expect(response.body).toHaveProperty('type', 'Memory Card');
      expect(response.body).toHaveProperty('brand', 'Samsung');
      expect(response.body).toHaveProperty('connectivity', 'SD');
    });

    it('should return 201 with null optional fields', async () => {
      const mockAccessory = {
        id: 4,
        type: 'Cable',
        brand: null,
        connectivity: null,
      };
      (prisma.accessory.create as jest.Mock).mockResolvedValue(mockAccessory);

      const response = await request(app)
        .post('/api/accessories')
        .send({ type: 'Cable' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('brand', null);
      expect(response.body).toHaveProperty('connectivity', null);
    });

    it('should return 500 when creation fails', async () => {
      (prisma.accessory.create as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const response = await request(app)
        .post('/api/accessories')
        .send({ type: 'Bad Accessory' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('PUT /api/accessories/:id', () => {
    it('should return 200 and the updated accessory', async () => {
      const mockAccessory = {
        id: 1,
        type: 'Wireless Controller',
        brand: 'Sony DualSense',
        connectivity: 'Bluetooth 5.1',
      };
      (prisma.accessory.update as jest.Mock).mockResolvedValue(mockAccessory);

      const response = await request(app)
        .put('/api/accessories/1')
        .send({
          type: 'Wireless Controller',
          brand: 'Sony DualSense',
          connectivity: 'Bluetooth 5.1',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('type', 'Wireless Controller');
      expect(response.body).toHaveProperty('brand', 'Sony DualSense');
      expect(response.body).toHaveProperty('connectivity', 'Bluetooth 5.1');
    });

    it('should return 500 when update fails', async () => {
      (prisma.accessory.update as jest.Mock).mockRejectedValue(
        new Error('Not found')
      );

      const response = await request(app)
        .put('/api/accessories/999')
        .send({ type: 'Nonexistent' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('DELETE /api/accessories/:id', () => {
    it('should return 204 with no content on successful deletion', async () => {
      (prisma.accessory.delete as jest.Mock).mockResolvedValue({ id: 1 });

      const response = await request(app).delete('/api/accessories/1');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should return 500 when deletion fails', async () => {
      (prisma.accessory.delete as jest.Mock).mockRejectedValue(
        new Error('Cannot delete')
      );

      const response = await request(app).delete('/api/accessories/999');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });
});

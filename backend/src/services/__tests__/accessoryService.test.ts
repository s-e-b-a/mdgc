import {
  getAllAccessories,
  addAccessory,
  updateAccessory,
  deleteAccessory,
} from '../accessoryService';

// Mock PrismaClient
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

describe('AccessoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAccessories', () => {
    it('should return all accessories', async () => {
      const mockAccessories = [
        { id: 1, type: 'Controller', brand: 'Sony', connectivity: 'Bluetooth' },
        { id: 2, type: 'Headset', brand: 'SteelSeries', connectivity: 'USB' },
      ];

      (prisma.accessory.findMany as jest.Mock).mockResolvedValue(mockAccessories);

      const result = await getAllAccessories();

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('Controller');
      expect(result[1].brand).toBe('SteelSeries');
      expect(prisma.accessory.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no accessories exist', async () => {
      (prisma.accessory.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getAllAccessories();

      expect(result).toEqual([]);
    });
  });

  describe('addAccessory', () => {
    it('should create a new accessory', async () => {
      const mockAccessory = {
        id: 1,
        type: 'Controller',
        brand: 'Microsoft',
        connectivity: 'Wireless',
      };

      (prisma.accessory.create as jest.Mock).mockResolvedValue(mockAccessory);

      const result = await addAccessory({
        type: 'Controller',
        brand: 'Microsoft',
        connectivity: 'Wireless',
      });

      expect(result).toEqual({
        id: 1,
        type: 'Controller',
        brand: 'Microsoft',
        connectivity: 'Wireless',
      });
      expect(prisma.accessory.create).toHaveBeenCalledWith({
        data: {
          type: 'Controller',
          brand: 'Microsoft',
          connectivity: 'Wireless',
        },
      });
    });
  });

  describe('updateAccessory', () => {
    it('should update an existing accessory', async () => {
      const mockAccessory = {
        id: 1,
        type: 'Updated Controller',
        brand: 'Sony',
        connectivity: 'USB-C',
      };

      (prisma.accessory.update as jest.Mock).mockResolvedValue(mockAccessory);

      const result = await updateAccessory(1, {
        type: 'Updated Controller',
        brand: 'Sony',
        connectivity: 'USB-C',
      });

      expect(result.type).toBe('Updated Controller');
      expect(prisma.accessory.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          type: 'Updated Controller',
          brand: 'Sony',
          connectivity: 'USB-C',
        },
      });
    });
  });

  describe('deleteAccessory', () => {
    it('should delete an accessory by id', async () => {
      (prisma.accessory.delete as jest.Mock).mockResolvedValue({ id: 1 });

      await deleteAccessory(1);

      expect(prisma.accessory.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});

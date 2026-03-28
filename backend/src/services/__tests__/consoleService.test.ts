import {
  getAllConsoles,
  addConsole,
  updateConsole,
  deleteConsole,
} from '../consoleService';

// Mock PrismaClient
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

describe('ConsoleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllConsoles', () => {
    it('should return all consoles with platform names', async () => {
      const mockConsoles = [
        {
          id: 1,
          model: 'PlayStation 5',
          serialNumber: 'SN123',
          colorEdition: 'White',
          status: 'Active',
          storageCapacity: '825GB',
          includedCables: 'HDMI, Power',
          platformId: 1,
          platform: { id: 1, name: 'PlayStation 5' },
        },
        {
          id: 2,
          model: 'Switch OLED',
          serialNumber: null,
          colorEdition: 'Neon',
          status: 'Active',
          storageCapacity: '64GB',
          includedCables: 'USB-C',
          platformId: null,
          platform: null,
        },
      ];

      (prisma.console.findMany as jest.Mock).mockResolvedValue(mockConsoles);

      const result = await getAllConsoles();

      expect(result).toHaveLength(2);
      expect(result[0].platformName).toBe('PlayStation 5');
      expect(result[1].platformName).toBeNull();
      expect(prisma.console.findMany).toHaveBeenCalledWith({
        include: { platform: true },
      });
    });
  });

  describe('addConsole', () => {
    it('should create a console with platformId', async () => {
      const mockConsole = {
        id: 1,
        model: 'PS5',
        serialNumber: 'SN456',
        colorEdition: 'Black',
        status: 'New',
        storageCapacity: '1TB',
        includedCables: 'HDMI',
        platformId: 1,
        platform: { id: 1, name: 'PlayStation 5' },
      };

      (prisma.console.create as jest.Mock).mockResolvedValue(mockConsole);

      const result = await addConsole({
        model: 'PS5',
        serialNumber: 'SN456',
        colorEdition: 'Black',
        status: 'New',
        storageCapacity: '1TB',
        includedCables: 'HDMI',
        platformId: 1,
      });

      expect(result.id).toBe(1);
      expect(result.platformName).toBe('PlayStation 5');
    });

    it('should create a console without platformId (matching Java if platformId > 0 logic)', async () => {
      const mockConsole = {
        id: 2,
        model: 'Generic Console',
        serialNumber: null,
        colorEdition: null,
        status: null,
        storageCapacity: null,
        includedCables: null,
        platformId: null,
        platform: null,
      };

      (prisma.console.create as jest.Mock).mockResolvedValue(mockConsole);

      const result = await addConsole({
        model: 'Generic Console',
        platformId: 0,
      });

      expect(result.platformId).toBeNull();
      expect(result.platformName).toBeNull();
    });
  });

  describe('updateConsole', () => {
    it('should update a console by id', async () => {
      const mockConsole = {
        id: 1,
        model: 'Updated Console',
        serialNumber: 'SN789',
        colorEdition: 'Red',
        status: 'Active',
        storageCapacity: '2TB',
        includedCables: 'HDMI, Power',
        platformId: 2,
        platform: { id: 2, name: 'Xbox' },
      };

      (prisma.console.update as jest.Mock).mockResolvedValue(mockConsole);

      const result = await updateConsole(1, {
        model: 'Updated Console',
        serialNumber: 'SN789',
        colorEdition: 'Red',
        status: 'Active',
        storageCapacity: '2TB',
        includedCables: 'HDMI, Power',
        platformId: 2,
      });

      expect(result.model).toBe('Updated Console');
      expect(result.platformName).toBe('Xbox');
    });
  });

  describe('deleteConsole', () => {
    it('should delete a console by id', async () => {
      (prisma.console.delete as jest.Mock).mockResolvedValue({ id: 1 });

      await deleteConsole(1);

      expect(prisma.console.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});

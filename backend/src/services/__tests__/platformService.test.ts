import {
  getAllPlatforms,
  addPlatform,
  updatePlatform,
  deletePlatform,
} from '../platformService';

// Mock PrismaClient
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

// Get mocked prisma instance
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('PlatformService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPlatforms', () => {
    it('should return all platforms', async () => {
      const mockPlatforms = [
        { id: 1, name: 'PlayStation 5' },
        { id: 2, name: 'Nintendo Switch' },
      ];
      (prisma.platform.findMany as jest.Mock).mockResolvedValue(mockPlatforms);

      const result = await getAllPlatforms();

      expect(result).toEqual(mockPlatforms);
      expect(prisma.platform.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no platforms exist', async () => {
      (prisma.platform.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getAllPlatforms();

      expect(result).toEqual([]);
    });
  });

  describe('addPlatform', () => {
    it('should create a new platform', async () => {
      const newPlatform = { id: 1, name: 'Xbox Series X' };
      (prisma.platform.create as jest.Mock).mockResolvedValue(newPlatform);

      const result = await addPlatform({ name: 'Xbox Series X' });

      expect(result).toEqual({ id: 1, name: 'Xbox Series X' });
      expect(prisma.platform.create).toHaveBeenCalledWith({
        data: { name: 'Xbox Series X' },
      });
    });
  });

  describe('updatePlatform', () => {
    it('should update an existing platform', async () => {
      const updatedPlatform = { id: 1, name: 'PlayStation 5 Pro' };
      (prisma.platform.update as jest.Mock).mockResolvedValue(updatedPlatform);

      const result = await updatePlatform(1, { name: 'PlayStation 5 Pro' });

      expect(result).toEqual({ id: 1, name: 'PlayStation 5 Pro' });
      expect(prisma.platform.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'PlayStation 5 Pro' },
      });
    });
  });

  describe('deletePlatform', () => {
    it('should delete a platform by id', async () => {
      (prisma.platform.delete as jest.Mock).mockResolvedValue({ id: 1, name: 'Old Platform' });

      await deletePlatform(1);

      expect(prisma.platform.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});

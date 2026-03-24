import { jest } from '@jest/globals';

export const mockPrisma = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    taskHistory: {
      create: jest.fn(),
    },
  };
import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service.js';
import { S3Service } from '../../infra/s3/s3.service.js';
import { PrismaService } from '../../infra/prisma/prisma.service.js';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: S3Service,
          useValue: { uploadFile: jest.fn(), deleteFile: jest.fn() },
        },
        {
          provide: PrismaService,
          useValue: { user: { findUnique: jest.fn(), update: jest.fn() } },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { mockPrisma } from './../../common/prisma.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;

  const prismaMock = mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    mockPrisma.task.create.mockResolvedValue({
      id: '1',
      title: 'Test task',
    });
  
    const result = await service.create('user1', {
      title: 'Test task',
    });
  
    expect(mockPrisma.task.create).toHaveBeenCalled();
    expect(result.title).toBe('Test task');
  });

  it('should return user tasks', async () => {
    mockPrisma.task.findMany.mockResolvedValue([]);
  
    await service.findAll('user1', {});
  
    expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user1',
        }),
      }),
    );
  });

  it('should update status and create history', async () => {
    mockPrisma.task.findFirst.mockResolvedValue({
      id: '1',
      status: 'TODO',
    });
  
    mockPrisma.task.update.mockResolvedValue({
      id: '1',
      status: 'DONE',
    });
  
    await service.update('1', 'user1', {
      status: 'DONE',
    });
  
    expect(mockPrisma.taskHistory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        from: 'TODO',
        to: 'DONE',
      }),
    });
  });

  it('should throw if task not found', async () => {
    mockPrisma.task.findFirst.mockResolvedValue(null);
  
    await expect(
      service.update('1', 'user1', { status: 'DONE' }),
    ).rejects.toThrow(NotFoundException);
  });
});

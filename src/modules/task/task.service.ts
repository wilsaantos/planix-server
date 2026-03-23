import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { QueryTaskDto } from './dto/query-task.dto.js';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        userId,
      },
    });
  }

  async findAll(userId: string, query: QueryTaskDto) {
    return this.prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        isArchived: false,
        ...(query.status && { status: query.status }),
        ...(query.search && {
          title: {
            contains: query.search,
            mode: 'insensitive' as const,
          },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) throw new NotFoundException();

    if (dto.status && dto.status !== task.status) {
      await this.prisma.taskHistory.create({
        data: {
          task: { connect: { id } },
          userId,
          from: task.status,
          to: dto.status,
        },
      });
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.isArchived && { archivedAt: new Date() }),
      },
    });
  }

  async archive(id: string, userId: string) {
    return this.update(id, userId, { isArchived: true });
  }

  async remove(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) throw new NotFoundException();

    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { prisma } from './prisma.provider.js';

@Injectable()
export class PrismaService {
  get user() { return prisma.user; }
  get task() { return prisma.task; }
  get taskHistory() { return prisma.taskHistory; }
}

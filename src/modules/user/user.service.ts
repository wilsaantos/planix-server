import { Injectable } from '@nestjs/common';
import { prisma } from '../../infra/prisma/prisma.provider.js';

@Injectable()
export class UserService {
  constructor() {}

  async create(email: string, password: string) {
    return prisma.user.create({
      data: { email, password },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async updateRefreshToken(userId: string, token: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { S3Service } from '../../infra/s3/s3.service.js';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private s3: S3Service,
  ) {}

  async create(email: string, password: string) {
    return this.prisma.user.create({
      data: { email, password },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        profileImageUrl: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    let profileImageUrl = user.profileImageUrl;
    if (profileImageUrl) {
      profileImageUrl = await this.s3.getPresignedUrl(profileImageUrl);
    }

    return { ...user, profileImageUrl };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateRefreshToken(userId: string, token: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }
}

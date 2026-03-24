import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { S3Service } from '../../infra/s3/s3.service.js';

@Injectable()
export class ProfileService {
  constructor(
    private readonly s3: S3Service,
    private readonly prisma: PrismaService,
  ) {}

  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.profileImageUpdatedAt) {
      const now = new Date();
      const diffHours =
        (now.getTime() - user.profileImageUpdatedAt.getTime()) / 1000 / 60 / 60;

      if (diffHours < 24) {
        throw new ForbiddenException(
          'You can only change your profile image once every 24 hours',
        );
      }
    }

    if (user.profileImageUrl) {
      await this.s3.deleteFile(user.profileImageUrl);
    }

    const imageUrl = await this.s3.uploadFile(file, `profile/${userId}`);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        profileImageUrl: imageUrl,
        profileImageUpdatedAt: new Date(),
      },
    });

    return { imageUrl };
  }
}
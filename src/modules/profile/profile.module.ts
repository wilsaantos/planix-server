import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { ProfileController } from './profile.controller.js';
import { S3Service } from '../../infra/s3/s3.service.js';

@Module({
  providers: [ProfileService, S3Service],
  controllers: [ProfileController],
})
export class ProfileModule {}

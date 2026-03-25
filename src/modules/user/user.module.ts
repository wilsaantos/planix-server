import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { S3Service } from '../../infra/s3/s3.service.js';

@Module({
  providers: [UserService, S3Service],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

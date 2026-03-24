import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UserModule } from './modules/user/user.module.js';
import { TaskModule } from './modules/task/task.module.js';
import { PrismaModule } from './infra/prisma/prisma.module.js';
import { ProfileModule } from './modules/profile/profile.module.js';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, TaskModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

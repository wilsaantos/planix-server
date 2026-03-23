import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { TaskStatus } from '../../../../generated/prisma/client.js';

export { TaskStatus };

export class UpdateTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
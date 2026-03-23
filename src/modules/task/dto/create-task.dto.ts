import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskPriority } from '../../../../generated/prisma/client.js';

export { TaskPriority };

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
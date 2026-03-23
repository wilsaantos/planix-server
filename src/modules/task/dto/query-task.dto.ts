import { IsOptional, IsEnum, IsString } from 'class-validator';
import { TaskStatus } from '../../../../generated/prisma/enums.js';

export class QueryTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

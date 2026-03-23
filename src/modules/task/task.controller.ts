import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Req,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { TaskService } from './task.service.js';
  import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard.js';
  import { CreateTaskDto } from './dto/create-task.dto.js';
  import { UpdateTaskDto } from './dto/update-task.dto.js';
  import { QueryTaskDto } from './dto/query-task.dto.js';
  
  @UseGuards(JwtAuthGuard)
  @Controller('tasks')
  export class TaskController {
    constructor(private readonly taskService: TaskService) {}
  
    @Post()
    create(@Req() req, @Body() dto: CreateTaskDto) {
      return this.taskService.create(req.user.sub, dto);
    }
  
    @Get()
    findAll(@Req() req, @Query() query: QueryTaskDto) {
      return this.taskService.findAll(req.user.sub, query);
    }
  
    @Patch(':id')
    update(
      @Param('id') id: string,
      @Req() req,
      @Body() dto: UpdateTaskDto,
    ) {
      return this.taskService.update(id, req.user.sub, dto);
    }
  
    @Patch(':id/archive')
    archive(@Param('id') id: string, @Req() req) {
      return this.taskService.archive(id, req.user.sub);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
      return this.taskService.remove(id, req.user.sub);
    }
  }
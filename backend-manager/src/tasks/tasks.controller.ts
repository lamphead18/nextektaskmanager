import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/user-request.interface';
import { TaskStatus } from '@prisma/client';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: TaskStatus,
    @Query('search') search?: string,
  ) {
    return this.tasksService.getUserTasks(req.user.userId, status, search);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') taskId: string) {
    return this.tasksService.getTaskById(req.user.userId, taskId);
  }

  @Put(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(req.user.userId, taskId, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') taskId: string) {
    return this.tasksService.deleteTask(req.user.userId, taskId);
  }
}

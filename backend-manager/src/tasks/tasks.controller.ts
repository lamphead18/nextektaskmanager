import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
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
  async createTask(
    @Req() req: AuthenticatedRequest,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(req.user.userId, createTaskDto);
  }

  @Get()
  async getUserTasks(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 5,
  ) {
    const validStatus = Object.values(TaskStatus).includes(status as TaskStatus)
      ? (status as TaskStatus)
      : undefined;

    return this.tasksService.getUserTasks(
      req.user.userId,
      validStatus,
      search,
      page,
      limit,
    );
  }

  @Get(':id')
  async getTaskById(
    @Req() req: AuthenticatedRequest,
    @Param('id') taskId: string,
  ) {
    return this.tasksService.getTaskById(req.user.userId, taskId);
  }

  @Put(':id')
  async updateTask(
    @Req() req: AuthenticatedRequest,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(req.user.userId, taskId, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(
    @Req() req: AuthenticatedRequest,
    @Param('id') taskId: string,
  ) {
    return this.tasksService.deleteTask(req.user.userId, taskId);
  }
}

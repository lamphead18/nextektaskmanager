import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || TaskStatus.PENDENTE, // Padrão: PENDENTE
        userId,
      },
    });
  }

  async getUserTasks(userId: string, status?: TaskStatus, search?: string) {
    return this.prisma.task.findMany({
      where: {
        userId,
        status: status ? status : undefined,
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
    });
  }

  async getTaskById(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    return task;
  }

  async updateTask(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.getTaskById(userId, taskId);

    return this.prisma.task.update({
      where: { id: task.id },
      data: {
        title: dto.title ?? task.title,
        description: dto.description ?? task.description,
        status: dto.status ?? task.status,
      },
    });
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await this.getTaskById(userId, taskId);

    return this.prisma.task.delete({
      where: { id: task.id },
    });
  }
}

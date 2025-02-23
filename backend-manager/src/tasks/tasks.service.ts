import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  private async invalidateCache(userId: string) {
    console.log(`🗑️ Limpando cache para o usuário ${userId}`);
    const keysToDelete = [
      `tasks:${userId}:all:page1`,
      `tasks:${userId}:PENDENTE:page1`,
      `tasks:${userId}:EM_ANDAMENTO:page1`,
      `tasks:${userId}:CONCLUIDA:page1`,
    ];

    for (const key of keysToDelete) {
      await this.redisService.deleteKey(key);
    }
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    const newTask = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || TaskStatus.PENDENTE,
        userId,
      },
    });

    await this.invalidateCache(userId);
    return newTask;
  }

  async getUserTasks(
    userId: string,
    status?: TaskStatus,
    search?: string,
    page: number = 1,
    limit: number = 5,
  ) {
    const cacheKey = `tasks:${userId}:${status || 'all'}:page${page}`;

    console.log(`🔍 Buscando no cache Redis com chave: ${cacheKey}`);
    const cachedTasks = await this.redisService.getKey(cacheKey);

    if (cachedTasks) {
      console.log(`✅ Dados encontrados no cache!`);
      return JSON.parse(cachedTasks);
    }

    console.log(`🚨 Nenhum dado no cache. Buscando no banco de dados...`);

    const skip = (page - 1) * limit;

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        status: status ? status : undefined,
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'desc' },
    });

    const totalTasks = await this.prisma.task.count({
      where: {
        userId,
        status: status ? status : undefined,
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
    });

    const response = {
      tasks,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
    };

    console.log(`💾 Salvando no Redis com chave: ${cacheKey}`);
    await this.redisService.setKey(cacheKey, JSON.stringify(response));

    return response;
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

    const updatedTask = await this.prisma.task.update({
      where: { id: task.id },
      data: {
        title: dto.title ?? task.title,
        description: dto.description ?? task.description,
        status: dto.status ?? task.status,
      },
    });

    await this.invalidateCache(userId);
    return updatedTask;
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await this.getTaskById(userId, taskId);

    await this.prisma.task.delete({
      where: { id: task.id },
    });

    console.log(`🗑️ Excluindo tarefa ${taskId} e invalidando cache...`);
    await this.invalidateCache(userId);
  }
}

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  private async invalidateCache(userId: string) {
    this.logger.debug(`🗑️ Limpando cache para o usuário ${userId}`);
    await this.redisService.deleteKey(`tasks:${userId}:all:page1`);
    await this.redisService.deleteKey(`tasks:${userId}:PENDENTE:page1`);
    await this.redisService.deleteKey(`tasks:${userId}:EM_ANDAMENTO:page1`);
    await this.redisService.deleteKey(`tasks:${userId}:CONCLUIDA:page1`);
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    this.logger.log(
      `➕ Criando nova tarefa para usuário ${userId}: ${JSON.stringify(dto)}`,
    );

    const newTask = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || TaskStatus.PENDENTE,
        userId,
      },
    });

    await this.invalidateCache(userId);
    this.logger.log(`✅ Tarefa criada: ${JSON.stringify(newTask)}`);
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
    this.logger.debug(
      `🔍 Buscando tarefas do usuário ${userId}, cacheKey: ${cacheKey}`,
    );

    const cachedTasks = await this.redisService.getKey(cacheKey);

    if (cachedTasks) {
      this.logger.debug(`✅ Dados encontrados no cache!`);
      return JSON.parse(cachedTasks);
    }

    this.logger.warn(`🚨 Nenhum dado no cache. Buscando no banco de dados...`);

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        status: status ? status : undefined,
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    const totalTasks = await this.prisma.task.count({
      where: {
        userId,
        status,
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
    });

    const response = {
      tasks,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
    };

    this.logger.log(`💾 Salvando dados no cache para o usuário ${userId}`);
    await this.redisService.setKey(cacheKey, JSON.stringify(response));

    return response;
  }

  async getTaskById(userId: string, taskId: string) {
    this.logger.log(`🔎 Buscando tarefa ${taskId} do usuário ${userId}`);

    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      this.logger.error(
        `❌ Tarefa ${taskId} não encontrada para usuário ${userId}`,
      );
      throw new NotFoundException('Tarefa não encontrada.');
    }

    return task;
  }

  async updateTask(userId: string, taskId: string, dto: UpdateTaskDto) {
    this.logger.log(
      `✏️ Atualizando tarefa ${taskId} do usuário ${userId}: ${JSON.stringify(dto)}`,
    );

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
    this.logger.log(`✅ Tarefa atualizada: ${JSON.stringify(updatedTask)}`);
    return updatedTask;
  }

  async deleteTask(userId: string, taskId: string) {
    this.logger.warn(`🗑️ Excluindo tarefa ${taskId} do usuário ${userId}`);

    const task = await this.getTaskById(userId, taskId);

    await this.prisma.task.delete({ where: { id: task.id } });

    await this.invalidateCache(userId);
    this.logger.log(`✅ Tarefa ${taskId} excluída com sucesso!`);
  }
}

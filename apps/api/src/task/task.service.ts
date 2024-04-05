import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HistoryService } from '../history/history.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
import { TaskWithList } from './task.type';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private historyService: HistoryService,
  ) { }

  async create(boardId: number, listId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = await this.prisma.task.create({
        data: {
          name: createTaskDto.name,
          description: createTaskDto.description,
          due_date: createTaskDto.due_date,
          ...(createTaskDto.priority_id && {
            priority: { connect: { id: createTaskDto.priority_id } },
          }),
          list: { connect: { id: listId, } },
          board: { connect: { id: boardId, } },
        },
        include: { list: true }
      });
      this.historyService.createTaskCreatedEntry(boardId, task);
      delete task.list;
      return task;
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(boardId: number, listId: number): Promise<Task[]> {
    try {
      return await this.prisma.task.findMany({ where: { board_id: boardId, list_id: listId } });
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(boardId: number, listId: number, id: number, includeList = false): Promise<Task | TaskWithList> {
    try {
      const task = await this.prisma.task.findFirst({
        where: { id, board_id: boardId, list_id: listId },
        include: { list: includeList }
      });
      if (!task) {
        throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
      }
      return task;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(boardId: number, listId: number, id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const oldTask = await this.findById(boardId, listId, id, true);
    try {
      const updatedTask = await this.prisma.task.update({
        where: { id, board_id: boardId, list_id: listId },
        data: { ...updateTaskDto }
      });
      this.historyService.createTaskUpdatedEntry(boardId, oldTask, updatedTask);      
      return updatedTask;
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async moveTo(boardId: number, listId: number, id: number, newListId: number): Promise<Task> {
    const oldTask = await this.findById(boardId, listId, id, true);
    try {
      const newList = await this.prisma.list.findFirst({ where: { id: newListId, board_id: boardId } });
      if (!newList) {
        throw new HttpException("New list not found", HttpStatus.NOT_FOUND);
      }
      const updatedTask = await this.prisma.task.update({
        where: { id, board_id: boardId, list_id: listId },
        data: { list: { connect: { id: newListId } } },
        include: { list: true }
      });
      this.historyService.createTaskMovedEntry(boardId, oldTask, updatedTask);
      delete updatedTask.list;
      return updatedTask;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('New list in board not found', HttpStatus.NOT_FOUND);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(boardId: number, listId: number, id: number): Promise<Task> {
    try {
      const deletedTask = await this.prisma.task.delete({
        where: { id, board_id: boardId, list_id: listId },
        include: { list: true }
      });
      await this.historyService.createTaskDeletedEntry(boardId, deletedTask);
      delete deletedTask.list;
      return deletedTask;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) { }

  async create(boardId: number, listId: number, createTaskDto: CreateTaskDto) {
    try {
      return await this.prisma.task.create({
        data: {
          name: createTaskDto.name,
          description: createTaskDto.description,
          due_date: createTaskDto.due_date,
          ...(createTaskDto.priority_id && {
            priority: {
              connect: { id: createTaskDto.priority_id },
            },
          }),
          list: {
            connect: { id: listId, },
          },
          board: {
            connect: { id: boardId, },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Priority not exist', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(boardId: number, listId: number) {
    try {
      return await this.prisma.task.findMany({
        where: {
          board_id: boardId,
          list_id: listId,
        },
      });
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(boardId: number, listId: number, id: number) {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          id,
          board_id: boardId,
          list_id: listId,
        },
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

  async update(boardId: number, listId: number, id: number, updateTaskDto: UpdateTaskDto) {
    await this.findById(boardId, listId, id);
    try {
      return await this.prisma.task.update({
        where: {
          id, board_id: boardId, list_id: listId
        },
        data: {
          name: updateTaskDto.name,
          description: updateTaskDto.description,
          due_date: updateTaskDto.due_date,
          ...(updateTaskDto.priority_id && {
            priority: {
              connect: { id: updateTaskDto.priority_id },
            },
          }),
        },
      });
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async moveTo(boardId: number, listId: number, id: number, newListId: number) {
    await this.findById(boardId, listId, id);
    try {
      const newList = await this.prisma.list.findFirst({
        where: { id: newListId, board_id: boardId },
      });
      if (!newList) {
        throw new HttpException("New list not found", HttpStatus.NOT_FOUND);
      }
      return await this.prisma.task.update({
        where: {
          id, board_id: boardId, list_id: listId
        },
        data: {
          list: { connect: { id: newList.id } }
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async remove(boardId: number, listId: number, id: number) {
    await this.findById(boardId, listId, id);
    try {
      return await this.prisma.task.delete({
        where: {
          id, board_id: boardId, list_id: listId
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Task to delete does not exist', HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

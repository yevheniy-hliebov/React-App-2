import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HistoryService } from '../history/history.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from '@prisma/client';

@Injectable()
export class ListService {
  constructor(
    private prisma: PrismaService,
    private historyService: HistoryService,
  ) { }

  async create(boardId: number, createListDto: CreateListDto): Promise<List> {
    // check is name unique in board
    const list = await this.prisma.list.findFirst({
      where: { name: createListDto.name, board_id: boardId }
    });
    if (list) {
      throw new HttpException('List name must be unique in board', HttpStatus.CONFLICT);
    }

    try {
      const list = await this.prisma.list.create({
        data: {
          name: createListDto.name,
          board: { connect: { id: boardId, }, },
        },
      });
      this.historyService.createListCreatedEntry(boardId, list);
      return list;
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(boardId: number, includeTasks = false): Promise<List[]> {
    try {
      return await this.prisma.list.findMany({
        where: { board: { id: boardId } },
        orderBy: { id: 'asc' },
        include: { tasks: includeTasks }
      });
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(boardId: number, id: number, includeTasks = false): Promise<List> {
    try {
      const list = await this.prisma.list.findFirst({
        where: { id, board_id: boardId },
        include: { tasks: includeTasks }
      });
      if (!list) {
        throw new HttpException("List not found", HttpStatus.NOT_FOUND);
      }
      return list;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(boardId: number, id: number, updateListDto: UpdateListDto): Promise<List> {
    // check is name unique in board
    const list = await this.prisma.list.findFirst({
      where: { name: updateListDto.name, board_id: boardId }
    });
    if (list && id !== list.id) {
      throw new HttpException('List name must be unique in board', HttpStatus.CONFLICT);
    }

    try {
      const oldList = await this.prisma.list.findFirst({
        where: { board_id: boardId, id: id }
      });
      const updatedList = await this.prisma.list.update({
        where: { id, board_id: boardId },
        data: { name: updateListDto.name, },
      });
      this.historyService.createListChangedEntry(boardId, oldList, updatedList)
      return updatedList;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('List to update does not exist', HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(boardId: number, id: number, new_list_id?: number): Promise<List> {
    try {
      const deletedList = await this.prisma.list.findFirst({
        where: { id, board_id: boardId },
        include: {
          tasks: {
            include: { list: true }
          }
        },
      });

      if (!deletedList) {
        throw new HttpException('List to delete does not exist', HttpStatus.NOT_FOUND);
      }

      if (new_list_id) {
        const updatedTasks = await Promise.all(
          deletedList.tasks.map(async (task) => {
            return await this.prisma.task.update({
              where: { id: task.id },
              data: { list_id: new_list_id },
              include: { list: true }
            });
          }),
        );
        this.historyService.createTasksMovedEntry(boardId, deletedList.tasks, updatedTasks);
      } else {
        await this.prisma.task.deleteMany({
          where: { board_id: boardId, list_id: id }
        })
        this.historyService.createTasksDeletedEntry(boardId, deletedList.tasks);
      }

      await this.prisma.list.delete({
        where: { id, board_id: boardId },
      });
      this.historyService.createListDeletedEntry(boardId, deletedList);

      return deletedList;
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) { }

  async create(boardId: number, createListDto: CreateListDto) {
    // check is name unique in board
    const list = await this.prisma.list.findFirst({
      where: { name: createListDto.name, board_id: boardId }
    });
    if (list) {
      throw new HttpException('List name must be unique in board', HttpStatus.CONFLICT);
    }

    try {
      return await this.prisma.list.create({
        data: {
          name: createListDto.name,
          board: {
            connect: { id: boardId, },
          },
        },
      });
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(boardId: number, includeTasks: boolean = false) {
    try {
      return await this.prisma.list.findMany({
        where: { board_id: boardId },
        orderBy: { id: 'asc' },
        include: {
          tasks: includeTasks
        }
      });
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(boardId: number, id: number) {
    try {
      const list = await this.prisma.list.findFirst({
        where: { id, board_id: boardId },
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

  async update(boardId: number, id: number, updateListDto: UpdateListDto) {
    // check is name unique in board
    const list = await this.prisma.list.findFirst({
      where: { name: updateListDto.name, board_id: boardId }
    });
    if (list && id !== list.id) {
      throw new HttpException('List name must be unique in board', HttpStatus.CONFLICT);
    }

    try {
      return await this.prisma.list.update({
        where: { id, board_id: boardId },
        data: { name: updateListDto.name, },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('List to update does not exist', HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(boardId: number, id: number) {
    try {
      return await this.prisma.list.delete({
        where: { id, board_id: boardId },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('List to delete does not exist', HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

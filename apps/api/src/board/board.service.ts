import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) { }

  async create(createBoardDto: CreateBoardDto) {
    try {
      return await this.prisma.board.create({
        data: { name: createBoardDto.name, },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Board name must be unique', HttpStatus.CONFLICT);
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      return await this.prisma.board.findMany({
        orderBy: { created_at: 'desc' }
      });
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number) {
    try {
      const board = await this.prisma.board.findUnique({
        where: { id, }
      });
      if (!board) {
        throw new HttpException("Board not found", HttpStatus.NOT_FOUND);
      }
      return board;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    try {
      return await this.prisma.board.update({
        where: { id, },
        data: { name: updateBoardDto.name, },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Board name must be unique', HttpStatus.CONFLICT);
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.board.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from '@prisma/client';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) { }

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
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

  async findAll(): Promise<Board[]> {
    try {
      return await this.prisma.board.findMany({
        orderBy: { created_at: 'desc' }
      });
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number): Promise<Board> {
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

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    try {
      return await this.prisma.board.update({
        where: { id, },
        data: { name: updateBoardDto.name, },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Board to update does not exist', HttpStatus.NOT_FOUND);
      }
      if (error.code === 'P2002') {
        throw new HttpException('Board name must be unique', HttpStatus.CONFLICT);
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number): Promise<Board> {
    try {
      return await this.prisma.board.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Board to delete does not exist', HttpStatus.NOT_FOUND);
      }
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

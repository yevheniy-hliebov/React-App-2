import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from '@prisma/client';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() createBoardDto: CreateBoardDto): Promise<{ success: boolean, board: Board }> {
    return { success: true, board: await this.boardService.create(createBoardDto) };
  }

  @Get()
  async findAll(): Promise<{ success: boolean, boards: Board[] }> {
    return { success: true, boards: await this.boardService.findAll() };
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<{ success: boolean, board: Board }> {
    if (isNaN(id)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, board: await this.boardService.findById(+id) };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBoardDto: UpdateBoardDto): Promise<{ success: boolean, board: Board }> {
    if (isNaN(id)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, board: await this.boardService.update(+id, updateBoardDto) };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: number): Promise<{ success: boolean }> {
    if (isNaN(id)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    await this.boardService.remove(+id);
    return { success: true };
  }
}

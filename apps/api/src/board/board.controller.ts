import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  async findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    return this.boardService.findById(+id);
  }
  
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBoardDto: UpdateBoardDto) {
    if (isNaN(id)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    return this.boardService.update(+id, updateBoardDto);
  }
  
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    return this.boardService.remove(+id);
  }
}

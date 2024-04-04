import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Controller('boards/:boardId/lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async create(@Param('boardId') boardId: number, @Body() createListDto: CreateListDto) {
    if (isNaN(boardId)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    return this.listService.create(+boardId, createListDto);
  }
  
  @Get()
  async findAll(@Param('boardId') boardId: number, @Query('includeTasks') includeTasks: string) {
    if (isNaN(boardId)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    return this.listService.findAll(+boardId, includeTasks === 'true');
  }

  @Get(':id')
  async findOne(@Param('boardId') boardId: number, @Param('id') id: number) {
    if (isNaN(boardId)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    if (isNaN(id)) {
      throw new HttpException('Invalid list id provided', HttpStatus.BAD_REQUEST);
    }
    return this.listService.findById(+boardId, +id);
  }

  @Put(':id')
  async update(@Param('boardId') boardId: number, @Param('id') id: number, @Body() updateListDto: UpdateListDto) {
    if (isNaN(boardId)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    if (isNaN(id)) {
      throw new HttpException('Invalid list id provided', HttpStatus.BAD_REQUEST);
    }
    return this.listService.update(+boardId, +id, updateListDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('boardId') boardId: number, @Param('id') id: number) {
    if (isNaN(boardId)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    if (isNaN(id)) {
      throw new HttpException('Invalid list id provided', HttpStatus.BAD_REQUEST);
    }
    return this.listService.remove(+boardId, +id);
  }
}
import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from '@prisma/client';

@Controller('boards/:boardId/lists')
export class ListController {
  constructor(private readonly listService: ListService) { }

  @Post()
  async create(@Param('boardId') boardId: number, @Body() createListDto: CreateListDto): Promise<{ success: boolean, list: List }> {
    if (isNaN(boardId)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, list: await this.listService.create(+boardId, createListDto) };
  }

  @Get()
  async findAll(@Param('boardId') boardId: number, @Query('includeTasks') includeTasks: string): Promise<{ success: boolean, lists: List[] }> {
    if (isNaN(boardId)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, lists: await this.listService.findAll(+boardId, includeTasks === 'true') };
  }

  @Get(':id')
  async findOne(@Param('boardId') boardId: number, @Param('id') id: number, @Query('includeTasks') includeTasks: string): Promise<{ success: boolean, list: List }> {
    if (isNaN(boardId)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    if (isNaN(id)) {
      throw new HttpException('Invalid list id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, list: await this.listService.findById(+boardId, +id, includeTasks === 'true') };
  }

  @Put(':id')
  async update(@Param('boardId') boardId: number, @Param('id') id: number, @Body() updateListDto: UpdateListDto): Promise<{ success: boolean, list: List }> {
    if (isNaN(boardId)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    if (isNaN(id)) {
      throw new HttpException('Invalid list id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, list: await this.listService.update(+boardId, +id, updateListDto) };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('boardId') boardId: number, @Param('id') id: number, @Query('newListId') new_list_id: number): Promise<{ success: boolean }> {
    if (isNaN(boardId)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    if (isNaN(id)) {
      throw new HttpException('Invalid list id provided', HttpStatus.BAD_REQUEST);
    }
    if (new_list_id && isNaN(new_list_id)) {
      throw new HttpException('Invalid new list id provided', HttpStatus.BAD_REQUEST);
    } else if (id === new_list_id) {
      throw new HttpException('New list id must be different from the list id', HttpStatus.BAD_REQUEST);
    }
    await this.listService.remove(+boardId, +id, +new_list_id);
    return { success: true };
  }
}
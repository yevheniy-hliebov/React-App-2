import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

@Controller('boards/:boardId/lists/:listId/tasks')
export class TaskController {
  constructor(private readonly tasksService: TaskService) { }

  @Post()
  @HttpCode(201)
  async create(@Param('boardId') boardId: number, @Param('listId') listId: number, @Body() createTaskDto: CreateTaskDto): Promise<{ success: boolean, task: Task }> {
    checkIsNaNId(boardId, listId);
    return { success: true, task: await this.tasksService.create(+boardId, +listId, createTaskDto) };
  }

  @Get()
  async findAll(@Param('boardId') boardId: number, @Param('listId') listId: number): Promise<{ success: boolean, tasks: Task[] }> {
    checkIsNaNId(boardId, listId);
    return { success: true, tasks: await this.tasksService.findAll(+boardId, +listId) };
  }

  @Get(':id')
  async findOne(@Param('boardId') boardId: number, @Param('listId') listId: number, @Param('id') id: number): Promise<{ success: boolean, task: Task }> {
    checkIsNaNId(boardId, listId, id);
    return { success: true, task: await this.tasksService.findById(+boardId, +listId, +id) };
  }

  @Put(':id')
  async update(@Param('boardId') boardId: number, @Param('listId') listId: number, @Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto): Promise<{ success: boolean, task: Task }> {
    checkIsNaNId(boardId, listId, id);
    return { success: true, task: await this.tasksService.update(+boardId, +listId, +id, updateTaskDto) };
  }

  @Put(':id/move-to')
  async moveTo(@Param('boardId') boardId: number, @Param('listId') listId: number, @Param('id') id: number, @Body('list_id') newListId: number): Promise<{ success: boolean, task: Task }> {
    checkIsNaNId(boardId, listId, id, newListId);
    return { success: true, task: await this.tasksService.moveTo(+boardId, +listId, +id, +newListId) };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('boardId') boardId: number, @Param('listId') listId: number, @Param('id') id: number): Promise<{ success: boolean }> {
    checkIsNaNId(boardId, listId, id);
    await this.tasksService.remove(+boardId, +listId, +id)
    return { success: true };
  }
}


function checkIsNaNId(boardId: number, listId: number, id?: number, newListId?: number) {
  if (isNaN(boardId)) {
    throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
  }
  if (isNaN(listId)) {
    throw new HttpException('Invalid list id provided', HttpStatus.BAD_REQUEST);
  }
  if (id && isNaN(id)) {
    throw new HttpException('Invalid task id provided', HttpStatus.BAD_REQUEST);
  }
  if (newListId && isNaN(newListId)) {
    throw new HttpException('Invalid new list id provided', HttpStatus.BAD_REQUEST);
  }
}
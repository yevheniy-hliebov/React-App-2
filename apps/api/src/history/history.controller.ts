import { Controller, Get, HttpCode, HttpException, HttpStatus, Param } from '@nestjs/common';
import { HistoryService } from './history.service';
import { History } from '@prisma/client';
import { MessageEntry } from './history.type';

@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) { }

  @Get("boards/:boardId")
  @HttpCode(HttpStatus.OK)
  async getAllHistoryBoard(@Param('boardId') boardId: number): Promise<{ success: boolean, history: History[] | MessageEntry[] }> {
    if (isNaN(boardId)) {
      throw new HttpException('Invalid board id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, history: await this.historyService.getAllHistoryBoard(+boardId) };
  }

  @Get('tasks/:id')
  @HttpCode(HttpStatus.OK)
  async getTaskHistory(@Param('id') id: number): Promise<{ success: boolean, task_history: History[] }> {
    if (isNaN(id)) {
      throw new HttpException('Invalid task id provided', HttpStatus.BAD_REQUEST);
    }
    return { success: true, task_history: await this.historyService.getTaskHistory(+id) };
  }
}

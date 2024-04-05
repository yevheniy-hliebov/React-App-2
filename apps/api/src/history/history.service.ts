import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { History, List } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHistoryDto } from './history.type';
import { TaskWithList } from '../task/task.type';

@Injectable()
export class HistoryService {
  private readonly MODEL_LIST = 'List';
  private readonly MODEL_TASK = 'Task';
  private readonly ACTION_CREATED = 'created';
  private readonly ACTION_MOVED = 'moved';
  private readonly ACTION_CHANGED = 'changed';
  private readonly ACTION_DELETED = 'deleted';

  constructor(private readonly prisma: PrismaService) { }

  private async createEntry(boardId: number, createHistoryDto: CreateHistoryDto): Promise<History> {
    try {
      return await this.prisma.history.create({ data: { board: { connect: { id: boardId } }, ...createHistoryDto } });
    } catch (error) {
      throw new HttpException('Failed to create history entry', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(boardId: number, createHistoryDto: CreateHistoryDto): Promise<History> {
    return this.createEntry(boardId, createHistoryDto);
  }

  async getAllHistoryBoard(boardId: number): Promise<History[]> {
    // return this.prisma.history.findMany({
    //   where: { board_id: boardId },
    //   orderBy: { created_at: 'desc' },
    // });
    const board = await this.prisma.board.findFirst({
      where: { id: boardId },
      include: {
        history: {
          orderBy: { created_at: 'desc' },
        }
      }
    });
    if (!board) {
      throw new HttpException("Board not found", HttpStatus.NOT_FOUND);
    }    
    return board.history;
  }

  async getTaskHistory(id: number): Promise<History[]> {
    return this.prisma.history.findMany({
      where: { model: this.MODEL_TASK, model_id: id },
      orderBy: { created_at: 'desc' },
    });
  }

  async createListCreatedEntry(boardId: number, list: List): Promise<void> {
    await this.createEntry(boardId, {
      action: this.ACTION_CREATED,
      model: this.MODEL_LIST,
      model_id: list.id,
      data: JSON.stringify({ name: list.name }),
    });
  }

  async createListChangedEntry(boardId: number, oldList: List, newList: List): Promise<void> {
    let nameRenamed = false;

    for (const key in newList) {
      if (key === 'id' || key === 'created_at' || key === 'updated_at') {
        continue;
      }

      if (oldList[key] !== newList[key]) {
        let old_value = String(newList[key]);
        let new_value = String(newList[key]);

        await this.createEntry(boardId, {
          action: this.ACTION_CHANGED,
          model: this.MODEL_LIST,
          model_id: oldList.id,
          data: JSON.stringify({
            name: !nameRenamed ? oldList.name : newList.name
          }),
          field: key,
          old_value: old_value,
          new_value: new_value,
        });
        nameRenamed = key === 'name' && oldList.name !== newList.name;
      }
    }
  }

  async createListDeletedEntry(boardId: number, list: List): Promise<void> {
    await this.createEntry(boardId, {
      action: this.ACTION_DELETED,
      model: this.MODEL_LIST,
      model_id: list.id,
      data: JSON.stringify({ name: list.name }),
    });
  }

  async createTaskCreatedEntry(boardId: number, task: TaskWithList): Promise<void> {
    await this.createEntry(boardId, {
      action: this.ACTION_CREATED,
      model: this.MODEL_TASK,
      model_id: task.id,
      data: JSON.stringify({ name: task.name, list_name: task.list.name }),
    });
  }

  async createTaskMovedEntry(boardId: number, oldTask: TaskWithList, updatedTask: TaskWithList): Promise<void> {
    await this.createEntry(boardId, {
      action: this.ACTION_MOVED,
      model: this.MODEL_TASK,
      model_id: oldTask.id,
      data: JSON.stringify({ name: oldTask.name, list_name: oldTask.list.name }),
      field: 'list_id',
      old_value: JSON.stringify({ list_id: oldTask.list_id, list_name: oldTask.list.name }),
      new_value: JSON.stringify({ list_id: updatedTask.list_id, list_name: updatedTask.list.name }),
    });
  }

  async createTasksMovedEntry(boardId: number, oldTasks: TaskWithList[], updatedTasks: TaskWithList[]): Promise<void> {
    for (let i = 0; i < updatedTasks.length; i++) {
      const oldTask = oldTasks[i];
      const updatedTask = updatedTasks[i];
      this.createTaskMovedEntry(boardId, oldTask, updatedTask);
    }
  }

  async createTaskUpdatedEntry(boardId: number, oldTask: TaskWithList, updatedTask: TaskWithList): Promise<void> {
    let nameRenamed = false;

    for (const key in updatedTask) {
      if (key === 'id' || key === 'list' || key === 'created_at' || key === 'updated_at') {
        continue;
      }

      if (oldTask[key] !== updatedTask[key]) {
        let old_value = String(oldTask[key]);
        let new_value = String(updatedTask[key]);

        if (this.shouldSkipDueDate(oldTask, updatedTask, key)) {
          continue;
        }

        await this.createEntry(boardId, {
          action: this.ACTION_CHANGED,
          model: this.MODEL_TASK,
          model_id: oldTask.id,
          data: JSON.stringify({
            name: !nameRenamed ? oldTask.name : updatedTask.name,
            list_name: oldTask.list.name,
          }),
          field: key,
          old_value: old_value,
          new_value: new_value,
        });

        nameRenamed = key === 'name' && oldTask.name !== updatedTask.name;
      }
    }
  }

  async createTaskDeletedEntry(boardId: number, task: TaskWithList): Promise<void> {
    await this.createEntry(boardId, {
      action: this.ACTION_DELETED,
      model: this.MODEL_TASK,
      model_id: task.id,
      data: JSON.stringify({ name: task.name, list_name: task.list.name }),
    });
  }

  async createTasksDeletedEntry(boardId: number, tasks: TaskWithList[]): Promise<void> {
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      this.createTaskDeletedEntry(boardId, task);
    }
  }

  private shouldSkipDueDate(oldTask: TaskWithList, updatedTask: TaskWithList, key: string): boolean {
    if (key !== 'due_date') {
      return false;
    }

    if (!oldTask.due_date && !updatedTask.due_date) {
      return true;
    }

    if (oldTask.due_date?.getTime() === updatedTask.due_date?.getTime()) {
      return true;
    }

    return false;
  }
}
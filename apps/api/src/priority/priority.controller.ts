import { Controller, Get } from '@nestjs/common';
import { PriorityService } from './priority.service';
import { Priority } from '@prisma/client';

@Controller('priorities')
export class PriorityController {
  constructor(private readonly priorityService: PriorityService) { }

  @Get()
  async findAll(): Promise<{ success: boolean, priorities: Priority[] }> {
    return { success: true, priorities: await this.priorityService.findAll() };
  }
}
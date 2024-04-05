import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [PrismaModule, HistoryModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule { }

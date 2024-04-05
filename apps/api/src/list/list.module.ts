import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [PrismaModule, HistoryModule],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule { }

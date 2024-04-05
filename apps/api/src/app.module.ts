import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BoardModule } from './board/board.module';
import { ListModule } from './list/list.module';
import { TaskModule } from './task/task.module';
import { HistoryModule } from './history/history.module';
import { PriorityModule } from './priority/priority.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    BoardModule,
    ListModule,
    TaskModule,
    PriorityModule,
    HistoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

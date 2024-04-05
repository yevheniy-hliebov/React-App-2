import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule { }

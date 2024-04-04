import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [
    PrismaModule
  ],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {}

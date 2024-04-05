import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PriorityController } from './priority.controller';
import { PriorityService } from './priority.service';

@Module({
  imports: [PrismaModule],
  controllers: [PriorityController],
  providers: [PriorityService],
  exports: [PriorityService],
})
export class PriorityModule { }

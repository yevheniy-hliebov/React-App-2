import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Priority } from '@prisma/client';

@Injectable()
export class PriorityService {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<Priority[]> {
    try {
      return await this.prisma.priority.findMany();
    } catch (error) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

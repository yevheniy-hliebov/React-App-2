import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsOptional()
  due_date: string;

  @IsInt()
  @IsOptional()
  priority_id: number;
}

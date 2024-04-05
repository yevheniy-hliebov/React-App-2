import { IsDateString, IsOptional, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()  
  @MinLength(3)  
  name: string;

  @IsOptional()
  description?: string;
  
  @IsOptional()
  @IsDateString()
  due_date?: Date;

  @IsOptional()
  @IsNumber()
  priority_id?: number;
}
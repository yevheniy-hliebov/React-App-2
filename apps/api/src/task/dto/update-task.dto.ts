import { IsOptional, IsDateString, IsNumber, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsNotEmpty()  
  @MinLength(3)  
  name?: string;

  @IsOptional()
  description?: string;
  
  @IsOptional()
  @IsDateString()
  due_date?: Date;

  @IsOptional()
  @IsNumber()
  priority_id?: number;
}

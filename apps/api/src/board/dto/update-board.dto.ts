import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  @IsOptional()
  name?: string;
}
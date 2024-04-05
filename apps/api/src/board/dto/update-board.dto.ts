import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsOptional()
  name?: string;
}
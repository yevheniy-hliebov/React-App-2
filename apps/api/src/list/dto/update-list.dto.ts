import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateListDto {
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsOptional()
  name?: string;
}
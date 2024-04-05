import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsNotEmpty()
  name: string;
}
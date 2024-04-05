import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateListDto {
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsNotEmpty()
  name: string;
}
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNameDto {
  @IsNotEmpty()
  @IsString()
  lastName: string; // 性

  @IsNotEmpty()
  @IsString()
  firstName: string; // 名
}

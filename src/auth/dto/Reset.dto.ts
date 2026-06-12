
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetDto {

  @IsNotEmpty()
  @IsString()
  password: string;



}

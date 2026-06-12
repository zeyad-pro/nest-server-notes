import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  isString,
  IsString,
  MaxLength,
  maxLength,
  Min,
  MinLength,
} from 'class-validator';

export class registerDto{
  @ApiProperty()
  @MinLength(3)
  @IsString()
  @MaxLength(20)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty()
  @MinLength(1)
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty()
  @Min(8)
  @IsNumber()
  number: number;

  @ApiProperty()
  @MinLength(8, { message: 'the password must be more than 8 letters' })
  @IsString()
  password: string;


}

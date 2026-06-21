import { IsEnum, IsNotEmpty, isString, IsString } from "class-validator";

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  des: string;


  @IsString()
  color: string;

  // @IsString()
  // _id: string;
}

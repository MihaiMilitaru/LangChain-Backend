import { IsNotEmpty, IsString } from 'class-validator';

export class ChapterDto {
  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  permissionSubject: string;
}

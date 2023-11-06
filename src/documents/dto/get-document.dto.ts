import { IsNotEmpty, IsString } from 'class-validator';
import { Chapter } from '../../chapters/entities/chapter.entity';

export class GetDocumentDto {
  @IsNotEmpty()
  @IsString()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsString()
  uploadDate: string;

  chapters: Chapter[];
}

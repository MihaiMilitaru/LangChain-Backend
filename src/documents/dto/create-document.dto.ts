import {IsDate, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {Chapter} from '../../chapters/entities/chapter.entity';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsDate()
  uploadDate: Date;

  chapters: Chapter[];
}

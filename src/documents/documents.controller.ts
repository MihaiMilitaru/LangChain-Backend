import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  UnprocessableEntityException, BadRequestException, Inject,
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {DocumentsService} from './documents.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {GetDocumentDto} from './dto/get-document.dto';
import {Chapter} from '../chapters/entities/chapter.entity';
import * as path from "path";
import * as fs from "fs";
import {CreateDocumentDto} from "./dto/create-document.dto";
import {diskStorage} from "multer";
import {v4 as uuidv4} from 'uuid';
import * as pdfParse from 'pdf-parse';
import {CheckPolicies} from "../ability/decorator";
import {Action} from "../roles/type";
import {ChainService} from "./chain.service";

@Controller('documents')
@ApiTags('documents')
@ApiBearerAuth('Access Token')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService,
  private readonly chainService: ChainService) {
  }

  @CheckPolicies((ability) => ability.can(Action.Manage, 'Document'))
  @Get('all')
  async getAllChapters(): Promise<GetDocumentDto[]> {
    return this.documentsService.getDocuments();
  }

  @CheckPolicies((ability) => ability.can(Action.Manage, 'Document'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage(({
      destination: 'storage/docs',
      filename: (req, file, callback) => {
        const ext: string = path.extname(file.originalname);
        const filename: string = uuidv4();
        callback(null, `${filename}${ext}`);
      },
    })),
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<GetDocumentDto | HttpException> {
    if (!file) {
      throw new BadRequestException('Document must be provided');
    }

    const {fileTypeFromFile} = await (eval('import("file-type")') as Promise<typeof import('file-type')>);
    const meta = await fileTypeFromFile(file.path);
    if (!meta || 'application/pdf' !== meta.mime) {
      await fs.unlink(file.path, (err) => {
        if (err) {
          console.log(err);
        }
      });
      throw new UnprocessableEntityException('File type not allowed');
    }

    const document = await this.readDoc(file, meta);
    return this.documentsService.createDocument(document);
  }

  @CheckPolicies((ability) => ability.can(Action.Manage, 'Document'))
  @Put(':id')
  async updateDocument(
    @Param('id') id: number,
    @Body() chapters: Chapter[],
  ): Promise<any> {
    return this.documentsService.updateDocument(id, chapters);
  }

  @CheckPolicies((ability) => ability.can(Action.Manage, 'Document'))
  @Delete(':id')
  async deleteDocument(@Param('id') id: number): Promise<void> {
    return this.documentsService.deleteDocument(id);
  }

  private async readDoc(file, meta): Promise<CreateDocumentDto> {
    const readFilePath = path.join(__dirname, '../../../', file.path);
    const dataBuffer = fs.readFileSync(readFilePath);
    const pdfData = await pdfParse(dataBuffer);
    const name = file.originalname.replace('.pdf', '.txt');
    const writeFilePath = path.join(__dirname, '../../../storage/docs', name);
    await fs.unlink(readFilePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    if (fs.existsSync(writeFilePath)) {
      throw new BadRequestException('File already exists');
    } else {
      fs.writeFileSync(writeFilePath, pdfData.text);
      await this.documentsService.refactorVectorestore();
    }

    const currentDate = new Date();
    const chapters: Chapter[] = [];

    return {
      name: file.originalname,
      path: writeFilePath,
      type: meta.mime,
      size: file.size,
      uploadDate: currentDate,
      chapters: chapters,
    };
  }
}

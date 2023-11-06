import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Document} from './entities/document.entity';
import {CreateDocumentDto} from './dto/create-document.dto';
import {GetDocumentDto} from './dto/get-document.dto';
import {ChaptersService} from '../chapters/chapters.service';
import {Chapter} from '../chapters/entities/chapter.entity';
import {unlink, readdir} from 'node:fs/promises';
import * as path from "path";
import { TextLoader } from 'langchain/document_loaders';
import { FaissStore } from 'langchain/vectorstores/faiss';
import {ChainService} from "./chain.service";
import { Document as DocumentLangchain } from 'langchain/document';
import * as fs from "fs";

// import { embeddings } from '../../src/documents/chain';
const vectorestore_path =  path.join(__dirname, '../../../storage/vectorestore');

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,

    private chaptersService: ChaptersService,

    private readonly chainService: ChainService
  ) {
  }

  async getDocuments(): Promise<GetDocumentDto[]> {
    const docs = await this.documentRepository.find({
      relations: {
        chapters: true,
      },
    });

    return docs.map((doc) => this.docToGetDocumentDto(doc));
  }

  async findDocumentByPath(path: string) {
    return this.documentRepository.findOne({
      where: {
        path: path,
      },
      relations: ['chapters'],
    })
  }

  async createDocument(data: CreateDocumentDto): Promise<GetDocumentDto> {
    try {
      const doc = await this.documentRepository.save(
        this.documentRepository.create(data),
      );
      return this.docToGetDocumentDto(doc);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async updateDocument(id: number, chapters: Array<Chapter>): Promise<any> {
    return this.documentRepository.findOneBy({id: id}).then((document) => {
      document.chapters = chapters;
      return this.documentRepository.save(document);
    });
  }

  async deleteDocument(id: number): Promise<void> {
    const doc = await this.documentRepository.findOneBy({id: id});
    try {
      await unlink(doc.path)
        .then(() => this.documentRepository.delete(id))
        .then(async() => {
          const files = await readdir(vectorestore_path);
          await Promise.all(
            files.map((file) => unlink(path.join(vectorestore_path, file)))
          );

          await this.refactorVectorestore();
        });
    } catch (e) {
      console.error(e);
    }
  }

  async refactorVectorestore(): Promise<void> {
    let newDocuments: DocumentLangchain[] = [];
    const pathToDocs = path.join(__dirname, '../../../storage/docs');
    const allDocs = fs.readdirSync(pathToDocs);
    if (allDocs.length !== 0) {
      for (const documentName of allDocs) {
        const pathToDoc = path.join(pathToDocs, documentName);
        const loader = new TextLoader(pathToDoc);
        const doc = await loader.load();
        const docs = await this.chainService.getSplitter().splitDocuments(doc)
        newDocuments.push(...docs);
      }
    } else {
      await this.chainService.initializeChain();
    }
    const vectorestores = await FaissStore.fromDocuments(newDocuments, this.chainService.getEmbeddings());
    await vectorestores.save(vectorestore_path);
    await this.chainService.initializeChain();
  }

  private formatSize(size: number) {
    let sizeCopy = size;
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    while (sizeCopy >= 1024 && unitIndex < units.length - 1) {
      sizeCopy /= 1024;
      unitIndex += 1;
    }
    return `${sizeCopy.toFixed(2)} ${units[unitIndex]}`;
  }

  private docToGetDocumentDto(doc) {
    return {
      id: doc.id,
      name: doc.name,
      type: doc.type,
      size: this.formatSize(doc.size),
      uploadDate: doc.uploadDate.toLocaleDateString(),
      chapters: doc.chapters,
    }
  }
}

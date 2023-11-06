import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DocumentsController} from './documents.controller';
import {DocumentsService} from './documents.service';
import {Document} from './entities/document.entity';
import {ChaptersModule} from '../chapters/chapters.module';
import {ChainService} from "./chain.service";


@Module({
  imports: [TypeOrmModule.forFeature([Document]), ChaptersModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, ChainService],
  exports: [ChainService, DocumentsService],
})
export class DocumentsModule {
}

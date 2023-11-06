import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Chapter} from './entities/chapter.entity';
import {ChapterDto} from './dto';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
  ) {
  }

  getAllChapters(): Promise<Chapter[]> {
    return this.chapterRepository.find();
  }

  getChapter(id: number): Promise<Chapter | null> {
    return this.chapterRepository.findOneBy({id: id});
  }

  createChapter(data: ChapterDto): Promise<Chapter> {
    return this.chapterRepository.save(this.chapterRepository.create(data));
  }

  async updateChapter(id: number, chapterDto: ChapterDto): Promise<any> {
    const chapterToUpdate = await this.chapterRepository.findOneBy({id: id});
    if (chapterToUpdate) {
      return this.chapterRepository.save({
        ...chapterToUpdate,
        ...chapterDto,
      })
    } else {
      throw new NotFoundException('Chapter not found');
    }
  }

  async deleteChapter(id: number): Promise<void> {
    await this.chapterRepository.delete(id);
  }
}

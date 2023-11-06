import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChapterDto } from './dto';
import { Chapter } from './entities/chapter.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {CheckPolicies} from "../ability/decorator";
import {Action} from "../roles/type";

@Controller('chapters')
@ApiTags('chapters')
@ApiBearerAuth('Access Token')
export class ChaptersController {
  constructor(private readonly chapterService: ChaptersService) {}

  @CheckPolicies((ability) => ability.can(Action.Manage, 'Chapter'))
  @Get('all')
  async getAllChapters(): Promise<Chapter[]> {
    return this.chapterService.getAllChapters();
  }

  @CheckPolicies((ability) => ability.can(Action.Manage, 'Chapter'))
  @Get(':id')
  async getChapter(@Param('id') id: number): Promise<Chapter | null> {
    return this.chapterService.getChapter(id);
  }

  @CheckPolicies((ability) => ability.can(Action.Manage, 'Chapter'))
  @Post()
  async createChapter(@Body() chapterDto: ChapterDto): Promise<Chapter> {
    return this.chapterService.createChapter(chapterDto);
  }

  @CheckPolicies((ability) => ability.can(Action.Manage, 'Chapter'))
  @Put(':id')
  async updateChapter(
    @Param('id') id: number,
    @Body() chapterDto: ChapterDto,
  ): Promise<any> {
    return this.chapterService.updateChapter(id, chapterDto);
  }

  @CheckPolicies((ability) => ability.can(Action.Manage, 'Chapter'))
  @Delete(':id')
  async deleteChapter(@Param('id') id: number): Promise<void> {
    return this.chapterService.deleteChapter(id);
  }
}

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Seeder } from '../db/seeder';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/config.interface';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private readonly seeder: Seeder,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seeder.run();
  }

  getHello(): string {
    const appConfig = this.configService.get<AppConfig>('application');
    return appConfig.name + ' - ' + appConfig.version;
  }
}

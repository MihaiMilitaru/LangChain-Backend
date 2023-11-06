import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicRoute } from './auth/decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @PublicRoute()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

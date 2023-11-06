import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { dataSourceOptions } from '../db/data-source';
import { Seeder } from '../db/seeder';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { AbilityModule } from './ability/ability.module';
import { ChaptersModule } from './chapters/chapters.module';
import { DocumentsModule } from './documents/documents.module';
import { MessagesModule } from "./messages/messages.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    AbilityModule,
    UsersModule,
    RolesModule,
    MailModule,
    ChaptersModule,
    DocumentsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService, Seeder],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}

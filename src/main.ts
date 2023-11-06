import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  CorsConfig,
  AppConfig,
  SwaggerConfig,
} from './config/config.interface';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('application');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || appConfig.name || 'NestJS API')
      .setDescription(
        swaggerConfig.description || appConfig.description || 'The NestJS API',
      )
      .setVersion(swaggerConfig.version || appConfig.version || '1.0')
      .addTag('auth')
      .addTag('admin')
      .addBearerAuth({ type: 'http' }, 'Access Token')
      .addBearerAuth({ type: 'http' }, 'Refresh Token')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(
    process.env.PORT || appConfig.port || 3000,
    process.env.HOST || appConfig.host || '127.0.0.1',
  );
}

process.on('unhandledRejection', (reason) => {
  const logger = new Logger('App');
  logger.error('Unhandled Promise rejection reason:' + reason, {
    stack: reason instanceof Error ? reason.stack : null,
  });
});

bootstrap().catch((error) => console.log(error));

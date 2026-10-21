import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { API_PREFIX } from '@date-planner/shared';
import { HttpExceptionFilter } from './common/http-exception.filter.js';

export function setupApp(app: INestApplication, origins: string[]): void {
  app.setGlobalPrefix(API_PREFIX);
  app.enableCors({ origin: origins });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableShutdownHooks();
}

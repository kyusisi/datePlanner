import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { setupApp } from './setup-app.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  setupApp(
    app,
    config
      .getOrThrow<string>('CORS_ORIGIN')
      .split(',')
      .map((origin) => origin.trim()),
  );
  await app.listen(config.getOrThrow<number>('API_PORT'));
}

bootstrap().catch(() => {
  console.error(
    'API startup failed. Check environment and port configuration.',
  );
  process.exitCode = 1;
});

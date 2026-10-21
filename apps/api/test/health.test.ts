import 'reflect-metadata';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HealthModule } from '../src/health/health.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { setupApp } from '../src/setup-app.js';
import { validateEnvironment } from '../src/config/environment.js';

describe('Health HTTP API (database boundary mocked)', () => {
  let app: INestApplication;
  let failDatabase = false;

  before(async () => {
    const module = await Test.createTestingModule({ imports: [HealthModule] })
      .overrideProvider(PrismaService)
      .useValue({
        checkConnection: async () => {
          if (failDatabase) throw new Error('secret database credentials');
        },
      })
      .compile();
    app = module.createNestApplication();
    setupApp(app, ['http://localhost:5173']);
    await app.init();
  });
  after(async () => {
    await app.close();
  });

  it('GET /api/v1/health returns service liveness', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect({ status: 'ok', service: 'date-planner-api' });
  });
  it('GET /api/v1/health/db returns connection status', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/health/db')
      .expect(200)
      .expect({ status: 'ok', database: 'connected' });
  });
  it('returns HTTP 503 with a safe error envelope on database failure', async () => {
    failDatabase = true;
    try {
      const response = await request(app.getHttpServer())
        .get('/api/v1/health/db')
        .expect(503);
      assert.equal(response.body.code, 'SERVICE_UNAVAILABLE');
      assert.equal(response.body.path, '/api/v1/health/db');
      assert.equal(response.body.message, 'Database connection unavailable');
      assert.ok(Number.isFinite(Date.parse(response.body.timestamp)));
      assert.ok(!response.text.includes('secret'));
    } finally {
      failDatabase = false;
    }
  });
  it('uses the same envelope for unknown routes', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/unknown')
      .expect(404);
    assert.equal(response.body.code, 'HTTP_404');
  });
  it('allows only configured CORS origins', async () => {
    const allowed = await request(app.getHttpServer())
      .get('/api/v1/health')
      .set('Origin', 'http://localhost:5173');
    assert.equal(
      allowed.headers['access-control-allow-origin'],
      'http://localhost:5173',
    );
    const denied = await request(app.getHttpServer())
      .get('/api/v1/health')
      .set('Origin', 'https://untrusted.example');
    assert.equal(denied.headers['access-control-allow-origin'], undefined);
  });
});

describe('Environment validation', () => {
  const valid = {
    DATABASE_URL: 'postgresql://user:password@localhost:5432/test',
    CORS_ORIGIN: 'http://localhost:5173',
  };
  it('applies defaults and converts ports', () => {
    assert.equal(validateEnvironment(valid).API_PORT, 3000);
    assert.equal(
      validateEnvironment({ ...valid, API_PORT: '4000' }).API_PORT,
      4000,
    );
  });
  it('rejects missing database URLs, invalid ports and wildcard origins', () => {
    assert.throws(() =>
      validateEnvironment({ CORS_ORIGIN: valid.CORS_ORIGIN }),
    );
    assert.throws(() => validateEnvironment({ ...valid, API_PORT: '70000' }));
    assert.throws(() => validateEnvironment({ ...valid, CORS_ORIGIN: '*' }));
  });
});

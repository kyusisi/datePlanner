import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'prisma/config';

config({
  path: fileURLToPath(new URL('../../.env', import.meta.url)),
  quiet: true,
});

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // Generating an empty client does not require a running database or a local .env.
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/date_planner',
  },
});

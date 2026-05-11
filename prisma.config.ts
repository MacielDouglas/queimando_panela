import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

const isTest = process.env.NODE_ENV === 'test';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: isTest ? env('DATABASE_URL_TEST') : env('DATABASE_URL'),
  },
});

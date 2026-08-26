import 'server-only';
import { z } from 'zod';

const envServerSchema = z.object({
  DATABASE_URL: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  BETTER_AUTH_SECRET: z.string().min(1),

  BETTER_AUTH_URL: z.string().min(1),

  R2_ENDPOINT: z.url(),
  R2_PUBLIC_URL: z.url(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),
  RESEND_API_KEY: z.string().optional(),

  GROQ_API_KEY: z.string().optional(),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type Env = z.infer<typeof envServerSchema>;

let cached: Env | null = null;

function loadEnv(): Env {
  if (!cached) {
    cached = envServerSchema.parse(process.env);
  }
  return cached;
}

/**
 * Validação lazy: o parse só roda no primeiro acesso em runtime,
 * nunca durante o build (page data collection não exige secrets).
 */
export const envServer: Env = new Proxy({} as Env, {
  get(_target, prop: string) {
    return loadEnv()[prop as keyof Env];
  },
});

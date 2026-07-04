import "server-only";
import { z } from "zod";

const envServerSchema = z.object({
  DATABASE_URL: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  BETTER_AUTH_SECRET: z.string().min(1),

  BETTER_AUTH_URL: z.string().min(1),

  R2_ENDPOINT: z.url(),
  R2_PUBLIC_URL: z.url(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),

  GROQ_API_KEY: z.string(),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const envServer = envServerSchema.parse(process.env);

export type Env = typeof envServer;

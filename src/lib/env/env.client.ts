import { z } from 'zod';

const envClientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_R2_STATIC_BASE_URL: z.string().url().optional(),
});

export const envClient = envClientSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_R2_STATIC_BASE_URL: process.env.NEXT_PUBLIC_R2_STATIC_BASE_URL,
});

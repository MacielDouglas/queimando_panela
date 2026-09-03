import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { envServer } from './env/env.server';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  baseURL:
    envServer.BETTER_AUTH_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'),
  trustedOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...(envServer.BETTER_AUTH_URL ? [envServer.BETTER_AUTH_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
  emailAndPassword: {
    enabled: true,
    password: { minLength: 8 },
  },
  socialProviders: {
    ...(envServer.GOOGLE_CLIENT_ID && envServer.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: envServer.GOOGLE_CLIENT_ID,
            clientSecret: envServer.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  secret: envServer.BETTER_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualizar a cada 24h
    cookieCache: { enabled: true },
  },
  rateLimit: {
    window: 60, // 1 minuto
    max: 10, // Max 10 tentativas
  },
});

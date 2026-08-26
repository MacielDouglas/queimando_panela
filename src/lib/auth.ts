import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { envServer } from './env/env.server';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
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
});

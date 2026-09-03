import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) {
  throw new Error("BETTER_AUTH_SECRET não configurado! Adicione no .env ou no ambiente da Vercel.");
}

const baseURL = process.env.BETTER_AUTH_URL;
if (!baseURL) {
  throw new Error("BETTER_AUTH_URL não configurado! Adicione no .env ou no ambiente da Vercel.");
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    password: { minLength: 8 },
  },
  secret,
  baseURL,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualizar a cada 24h
    cookieCache: { enabled: true },
  },
  rateLimit: {
    window: 60, // 1 minuto
    max: 10, // Max 10 tentativas
  },
  trustedOrigins: [baseURL],
});

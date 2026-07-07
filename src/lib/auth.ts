import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendResetPasswordEmail } from "@/lib/email/send-reset-password-email";
import { envServer } from "@/lib/env/env.server";
import { prisma } from "@/lib/prisma";

const googleClientId = envServer.GOOGLE_CLIENT_ID;
const googleClientSecret = envServer.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: envServer.BETTER_AUTH_SECRET,
  baseURL: envServer.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      void sendResetPasswordEmail({
        to: user.email,
        resetUrl: url,
        name: user.name,
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Senha redefinida com sucesso para ${user.email}`);
    },
  },

  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {},

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  trustedOrigins: [envServer.BETTER_AUTH_URL || "http://localhost:3000"],
  plugins: [nextCookies()],
});

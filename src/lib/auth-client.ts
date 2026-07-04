import { createAuthClient } from "better-auth/react";
import { envClient } from "@/lib/env/env.client";

export const authClient = createAuthClient({
  baseURL: envClient.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signUp, useSession } = createAuthClient();

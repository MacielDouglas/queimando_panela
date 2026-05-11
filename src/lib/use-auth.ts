'use client';

import { authClient } from './auth-client';

export const useAuth = () => {
  const session = authClient.useSession();
  return {
    session,
    signInEmail: authClient.signIn.email,
    signUpEmail: authClient.signUp.email,
    signOut: authClient.signOut,
  };
};

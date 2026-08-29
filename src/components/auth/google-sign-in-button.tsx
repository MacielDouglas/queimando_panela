'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function GoogleSignInButton() {
  const [isPending, setIsPending] = useState(false);

  async function handleGoogleSignIn() {
    try {
      setIsPending(true);

      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={isPending}
      className="h-12 w-full rounded-full border bg-white font-bold"
      style={{
        borderColor: 'var(--line)',
        color: 'var(--cocoa)',
      }}
    >
      <FcGoogle className="mr-2 size-5" />
      {isPending ? 'Conectando...' : 'Continuar com Google'}
    </Button>
  );
}

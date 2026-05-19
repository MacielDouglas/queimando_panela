'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setIsSigningOut(true);
    setError(null);

    try {
      const result = await authClient.signOut(); // método recomendado no client[web:134]

      if (result.error) {
        setError(result.error.message ?? 'Não foi possível sair.');
        return;
      }

      router.replace('/login');
      router.refresh();
    } catch {
      setError('Erro inesperado ao sair.');
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSigningOut ? 'Saindo...' : 'Sair'}
      </button>

      {error && (
        <p className="text-[11px] text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

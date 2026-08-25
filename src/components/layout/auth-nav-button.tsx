'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

type AuthNavButtonProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AuthNavButton({ className, onNavigate }: AuthNavButtonProps) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isAuthenticated = Boolean(data?.user);

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          onNavigate?.();
          router.push('/');
          router.refresh();
        },
        onError: () => {
          setIsSigningOut(false);
        },
      },
    });
  }

  if (isPending) {
    return (
      <div className={cn('h-12 w-28 animate-pulse bg-[#e5e5e5]', className)} />
    );
  }

  if (isAuthenticated) {
    return (
      <Button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className={cn(
          'h-12 border border-[#0a0a0a] bg-[#0a0a0a] px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-[#0a0a0a]',
          className,
        )}
      >
        {isSigningOut ? 'Saindo...' : 'Sair'}
      </Button>
    );
  }

  return (
    <Button
      asChild
      onClick={onNavigate}
      className={cn(
        'h-12 border border-[#0a0a0a] bg-[#0a0a0a] px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-[#0a0a0a]',
        className,
      )}
    >
      <Link href="/sign-in">Entrar</Link>
    </Button>
  );
}

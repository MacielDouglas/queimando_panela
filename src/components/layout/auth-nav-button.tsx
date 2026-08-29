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
      <div
        className={cn('h-[42px] w-28 animate-pulse', className)}
        style={{ background: 'var(--line)' }}
        aria-busy="true"
        aria-live="polite"
        role="status"
      >
        <span className="sr-only">Carregando sessão</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className={cn(
          'h-[42px] rounded-full border px-[17px] text-[0.88rem] font-bold transition-colors',
          className,
        )}
        style={{
          borderColor: 'var(--cocoa)',
          color: 'var(--cocoa)',
          background: 'transparent',
        }}
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
        'button-queimando-panela button-primary-queimando-panela h-[42px] px-[17px] text-[0.88rem]',
        className,
      )}
    >
      <Link href="/sign-in">Entrar</Link>
    </Button>
  );
}

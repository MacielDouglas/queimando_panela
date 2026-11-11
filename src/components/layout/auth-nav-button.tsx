'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type MouseEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

type AuthNavButtonProps = {
  className?: string;
  onNavigate?: () => void;
};

// Tempo da animação de saída do menu mobile (`duration-200` no SheetContent).
// Navegar antes disso faz o painel reaparecer semitransparente sobre a página
// de destino enquanto termina de fechar.
const MENU_CLOSE_MS = 200;

export function AuthNavButton({ className, onNavigate }: AuthNavButtonProps) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isAuthenticated = Boolean(data?.user);

  function handleSignInClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate();
    window.setTimeout(() => router.push('/sign-in'), MENU_CLOSE_MS);
  }

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
      className={cn(
        'button-queimando-panela button-primary-queimando-panela h-[42px] px-[17px] text-[0.88rem]',
        className,
      )}
    >
      <Link href="/sign-in" onClick={handleSignInClick}>
        Entrar
      </Link>
    </Button>
  );
}

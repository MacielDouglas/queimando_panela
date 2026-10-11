'use client';

import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

/**
 * Ilha client: verifica a sessão no browser (cookie cache do better-auth).
 * Mantém a página /receitas 100% estática/ISR — sem headers()/DB por visita.
 */
export function PublishRecipeButton() {
  const { data, isPending } = authClient.useSession();

  if (isPending || !data?.user) return null;

  return (
    <Link
      href="/receitas/new"
      prefetch={false}
      className="button-queimando-panela button-primary-queimando-panela"
    >
      Publicar receita
      <span aria-hidden="true">→</span>
    </Link>
  );
}

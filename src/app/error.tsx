'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div
          className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-amber-100"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 64 64"
            className="size-8 text-amber-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="1.5" y="1.5" width="61" height="61" rx="4" />
            <path d="M16 25.5C16 19.7 20.5 16 26.6 16C32.7 16 37.2 19.8 37.2 25.5C37.2 31.3 32.7 35.2 26.6 35.2C20.5 35.2 16 31.3 16 25.5ZM21 25.5C21 28.7 23.2 31 26.6 31C30 31 32.2 28.7 32.2 25.5C32.2 22.4 30 20.2 26.6 20.2C23.2 20.2 21 22.4 21 25.5ZM29.8 32.8L37.6 40.8" />
            <path d="M41 16V41M41 16H49.8C55.1 16 58 19.2 58 23.9C58 28.6 55.1 31.8 49.8 31.8H41" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-amber-900 sm:text-3xl">
          Algo deu errado na cozinha
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-amber-700 sm:text-base">
          Não foi possível carregar as receitas agora. Pode ser um problema
          temporário — tente novamente ou volte mais tarde.
        </p>

        {error.digest && (
          <p className="mt-2 text-xs text-amber-500/60">
            Erro: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={unstable_retry}
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-amber-500 px-7 text-sm font-bold text-neutral-950 transition-colors hover:bg-amber-400 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
          >
            Tentar novamente
          </button>

          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-amber-300 bg-transparent px-7 text-sm font-semibold text-amber-800 transition-colors hover:border-amber-400 hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}

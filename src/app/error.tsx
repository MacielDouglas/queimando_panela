'use client';

import Link from 'next/link';
import { useEffect } from 'react';

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
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="w-full max-w-md bg-white p-8"
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="mx-auto mb-6 grid size-14 place-items-center"
          style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--line)',
            background: 'var(--food-accent)',
          }}
        >
          <span
            className="font-display text-xl font-extrabold"
            style={{ color: 'white' }}
          >
            !
          </span>
        </div>
        <h1
          className="text-center font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.02em]"
          style={{ color: 'var(--cocoa)' }}
        >
          Algo queimou na cozinha
        </h1>
        <p
          className="mt-3 text-center text-sm leading-6"
          style={{ color: 'var(--ink-muted)' }}
        >
          Não foi possível carregar. Tente novamente — sem pop-up, sem
          enrolação.
        </p>
        {error.digest && (
          <p
            className="mt-2 border px-3 py-2 text-center font-mono text-xs"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--muted)',
              color: 'var(--ink-muted)',
            }}
          >
            Erro: {error.digest}
          </p>
        )}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={unstable_retry}
            className="button-queimando-panela button-primary-queimando-panela"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="button-queimando-panela button-outline-queimando-panela"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}

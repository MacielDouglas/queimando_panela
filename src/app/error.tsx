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
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md border-2 border-[#0a0a0a] bg-white p-8">
        <div className="mx-auto mb-6 grid size-14 place-items-center border-2 border-[#0a0a0a] bg-[#ffc733] text-[#0a0a0a]">
          <span className="font-display text-xl font-extrabold">!</span>
        </div>
        <h1 className="text-center font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.02em] text-[#0a0a0a]">
          Algo queimou na cozinha
        </h1>
        <p className="mt-3 text-center font-sans text-sm leading-6 text-[#6b6b6b]">
          Não foi possível carregar. Tente novamente — sem pop-up, sem
          enrolação.
        </p>
        {error.digest && (
          <p className="mt-2 border border-[#e5e5e5] bg-[#f5f5f5] px-3 py-2 text-center font-mono text-xs text-[#6b6b6b]">
            Erro: {error.digest}
          </p>
        )}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={unstable_retry}
            className="h-12 border-2 border-[#0a0a0a] bg-[#ffc733] font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="grid h-12 place-items-center border-2 border-[#0a0a0a] bg-white font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}

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
      <div className="w-full max-w-md border-2 border-[#1b2920] bg-white p-8">
        <div className="mx-auto mb-6 grid size-14 place-items-center border-2 border-[#1b2920] bg-[#a85131] text-[#1b2920]">
          <span className="font-display text-xl font-extrabold">!</span>
        </div>
        <h1 className="text-center font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.02em] text-[#1b2920]">
          Algo queimou na cozinha
        </h1>
        <p className="mt-3 text-center font-sans text-sm leading-6 text-[#3e4d42]">
          Não foi possível carregar. Tente novamente — sem pop-up, sem
          enrolação.
        </p>
        {error.digest && (
          <p className="mt-2 border border-[rgba(27,41,32,0.16)] bg-[#e8ddca] px-3 py-2 text-center font-mono text-xs text-[#3e4d42]">
            Erro: {error.digest}
          </p>
        )}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={unstable_retry}
            className="h-12 border-2 border-[#1b2920] bg-[#a85131] font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#1b2920] hover:bg-[#1b2920] hover:text-white"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="grid h-12 place-items-center border-2 border-[#1b2920] bg-white font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#1b2920] hover:bg-[#1b2920] hover:text-white"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}

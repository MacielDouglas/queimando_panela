import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Acesso restrito',
  description: 'Você não tem permissão para acessar esta página.',
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <main className="min-h-dvh bg-white grid place-items-center p-6">
      <div className="w-full max-w-xl border-2 border-[#1b2920] bg-white">
        <div className="p-8">
          <p className="inline-block bg-[#1b2920] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#a85131]">
            Acesso restrito
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.02em] text-[#1b2920]">
            Sem permissão para acessar.
          </h1>
          <p className="mt-3 max-w-lg border-l border-[rgba(27,41,32,0.16)] pl-3 font-sans text-sm leading-6 text-[#3e4d42]">
            Faça login com conta válida ou volte para as receitas públicas —
            quadrado e amarelo.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/sign-in"
              className="grid h-12 place-items-center border-2 border-[#1b2920] bg-[#a85131] font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#1b2920] hover:bg-[#1b2920] hover:text-white"
            >
              Entrar
            </Link>
            <Link
              href="/"
              className="grid h-12 place-items-center border-2 border-[#1b2920] bg-white font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#1b2920] hover:bg-[#1b2920] hover:text-white"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

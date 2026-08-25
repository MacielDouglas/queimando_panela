import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLinkHref: string;
  footerLinkLabel: string;
};

export function AuthShell({
  title,
  description,
  children,
  footerText,
  footerLinkHref,
  footerLinkLabel,
}: AuthShellProps) {
  return (
    <main className="min-h-dvh bg-white">
      <div className="h-[6px] bg-[#ffb900]" aria-hidden="true" />
      <div className="mx-auto flex min-h-[calc(100dvh-6px)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl border-2 border-[#0a0a0a] bg-white md:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden border-r-2 border-[#0a0a0a] bg-[#0a0a0a] md:flex md:flex-col md:justify-between text-white">
            <div className="p-8 lg:p-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#ffb900] px-3 py-1 text-[#0a0a0a]"
              >
                <span className="size-7 bg-[#0a0a0a] text-[#ffb900] grid place-items-center font-display text-xs font-extrabold">
                  QP
                </span>
                <span className="font-display text-xs font-extrabold uppercase tracking-[0.14em]">
                  Queimando Panela
                </span>
              </Link>
              <div className="mt-12 max-w-md space-y-4">
                <p className="inline-block bg-[#ffb900] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
                  Blog culinário Queimando Panela
                </p>
                <h1 className="font-display text-4xl font-extrabold uppercase leading-none tracking-[-0.02em] text-white">
                  Receitas para
                  <br />
                  guardar, testar
                  <br />e compartilhar.
                </h1>
                <p className="font-sans text-sm leading-6 text-white/60">
                  Entre para salvar suas favoritas e enviar novas receitas para
                  a comunidade — quadrado e amarelo.
                </p>
              </div>
            </div>
            <div className="border-t-2 border-[#ffb900] bg-[#ffb900] p-6">
              <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
                Simples, claro e direto
              </p>
              <p className="mt-1 font-sans text-sm leading-5 text-[#0a0a0a]">
                Um espaço aberto para quem gosta de cozinhar em casa.
              </p>
            </div>
          </section>

          <section className="flex items-center justify-center bg-white">
            <div className="w-full max-w-md px-6 py-8 sm:px-8">
              <div className="border-l-[4px] border-[#ffb900] pl-3">
                <h2 className="font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.02em] text-[#0a0a0a]">
                  {title}
                </h2>
                <p className="mt-2 font-sans text-sm leading-5 text-[#6b6b6b]">
                  {description}
                </p>
              </div>

              <div className="mt-6">{children}</div>

              <p className="mt-6 border-t-2 border-[#0a0a0a] pt-4 font-sans text-sm text-[#6b6b6b]">
                {footerText}{' '}
                <Link
                  href={footerLinkHref}
                  className="font-display font-extrabold uppercase tracking-[0.08em] text-[#0a0a0a] underline decoration-[#ffb900] decoration-2 underline-offset-4 hover:bg-[#ffb900]"
                >
                  {footerLinkLabel}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

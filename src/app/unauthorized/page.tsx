import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Acesso restrito',
  description: 'Você não tem permissão para acessar esta página.',
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <main
      className="min-h-dvh grid place-items-center p-6"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="w-full max-w-xl bg-white"
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="p-8">
          <p
            className="eyebrow-queimando-panela inline-block"
            style={{ background: 'var(--cocoa)', color: 'var(--food-accent)' }}
          >
            Acesso restrito
          </p>
          <h1
            className="mt-3 font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.02em]"
            style={{ color: 'var(--cocoa)' }}
          >
            Sem permissão para acessar.
          </h1>
          <p
            className="mt-3 max-w-lg border-l pl-3 text-sm leading-6"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-muted)' }}
          >
            Faça login com conta válida ou volte para as receitas públicas.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/sign-in"
              className="button-queimando-panela button-primary-queimando-panela"
            >
              Entrar
            </Link>
            <Link
              href="/"
              className="button-queimando-panela button-outline-queimando-panela"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

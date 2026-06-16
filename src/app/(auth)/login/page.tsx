import { AuthForm } from '@/features/auth/components/AuthForm';
import { ChefHat } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Entrar | Queimando Panela',
  description:
    'Acesse sua conta no Queimando Panela e explore receitas autorais, histórias culinárias e dicas de cozinha preparadas com carinho.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Entrar | Queimando Panela',
    description: 'Acesse sua conta e volte para a cozinha.',
    url: 'https://queimandopanela.com.br/login',
    siteName: 'Queimando Panela',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function LoginPage() {
  return (
    <main
      className="relative min-h-svh bg-taupe-900 md:grid md:grid-cols-2"
      aria-label="Página de acesso à conta"
    >
      {/* ── Imagem hero — desktop ── */}
      <div className="relative hidden md:block" aria-hidden="true">
        <Image
          src="/login.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* ── Imagem hero — mobile (overlay) ── */}
      <div className="absolute inset-0 md:hidden" aria-hidden="true">
        <Image
          src="/login.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-taupe-900/70" />
      </div>

      {/* ── Painel do formulário ── */}
      <section
        className="relative z-10 flex min-h-svh items-center justify-center px-5 pt-30 sm:px-10 md:min-h-0"
        aria-labelledby="login-heading"
      >
        <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
          <div
            className="inline-flex items-center gap-2 border border-stone-600 px-4 py-2 text-sm font-medium text-stone-300"
            role="presentation"
          >
            <ChefHat
              className="h-4 w-4 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            Bem-vindo de volta
          </div>

          <div className="space-y-4">
            <h1
              id="login-heading"
              className="text-4xl leading-tight font-black tracking-tight text-stone-100 sm:text-5xl"
            >
              Entre no <span className="text-amber-500">Queimando Panela</span>
            </h1>
            <p className="mx-auto max-w-lg text-base leading-relaxed text-stone-400">
              Receitas autorais, histórias culinárias, dicas de cozinha e
              sabores preparados com carinho.
            </p>
            <p className="text-sm font-medium text-amber-600">
              A cozinha já está quente 🔥
            </p>
          </div>

          <AuthForm mode="login" />
        </div>
      </section>
    </main>
  );
}

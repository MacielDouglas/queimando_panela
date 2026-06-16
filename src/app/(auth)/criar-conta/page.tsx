import { AuthForm } from '@/features/auth/components/AuthForm';
import { ChefHat } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Criar conta | Queimando Panela',
  description:
    'Crie sua conta gratuita no Queimando Panela e junte-se a uma comunidade apaixonada por receitas, sabores e experiências gastronômicas.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Criar conta | Queimando Panela',
    description: 'Entre para uma comunidade apaixonada por gastronomia.',
    url: 'https://queimandopanela.com.br/criar-conta',
    siteName: 'Queimando Panela',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function NewUserPage() {
  return (
    <main
      className="relative min-h-svh bg-taupe-900 md:grid md:grid-cols-2"
      aria-label="Página de criação de conta"
    >
      {/* ── Imagem hero — desktop ── */}
      <div className="relative hidden md:block" aria-hidden="true">
        <Image
          src="/new_user.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* ── Imagem hero — mobile (overlay) ── */}
      <div className="absolute inset-0 md:hidden" aria-hidden="true">
        <Image
          src="/new_user.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-taupe-900/70" />
      </div>
      {/* ── Painel do formulário (esquerda no desktop) ── */}
      <section
        className="relative z-10 flex min-h-svh items-center justify-center px-5 pt-30 sm:px-10 md:min-h-0"
        aria-labelledby="signup-heading"
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
            A cozinha está aberta
          </div>

          <div className="space-y-4">
            <h1
              id="signup-heading"
              className="text-2xl leading-tight font-black tracking-tight text-stone-100 sm:text-3xl"
            >
              Crie sua conta no{' '}
              <span className="text-amber-500">Queimando Panela</span>
            </h1>
            <p className="mx-auto max-w-lg text-base leading-relaxed text-stone-400">
              Entre para uma comunidade apaixonada por receitas, sabores,
              histórias e experiências gastronômicas.
            </p>
            <p className="text-sm font-medium text-amber-600">
              Sua próxima receita começa aqui 🍲
            </p>
          </div>

          <AuthForm mode="signup" />
        </div>
      </section>
    </main>
  );
}

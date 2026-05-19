import type { Metadata } from 'next';
import { ChefHat } from 'lucide-react';

import { SignInForm } from '@/features/auth/components/SignInForm';

export const metadata: Metadata = {
  title: 'Entrar | Queimando Panela',
};

export default function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffaf2]">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_45%)]"
      />

      <div
        aria-hidden
        className="absolute -top-32 right-30 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl"
      />

      <div
        aria-hidden
        className="absolute bottom-30 left-30 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl"
      />

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16">
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
              <ChefHat className="h-4 w-4" />
              Bem-vindo de volta
            </div>

            <div className="space-y-5">
              <h1 className="max-w-2xl text-5xl font-black tracking-tight text-neutral-900 sm:text-6xl">
                Entre no{' '}
                <span className="text-amber-500">Queimando Panela</span>
              </h1>

              <p className="max-w-xl text-lg leading-8 text-neutral-600">
                Receitas autorais, histórias culinárias, dicas de cozinha e
                sabores preparados com carinho.
              </p>

              <p className="font-medium text-amber-700">
                A cozinha já está quente 🔥
              </p>
            </div>

            {/* decorative dots */}
            <div className="flex items-center gap-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-3 w-3 rounded-full bg-amber-500" />
              ))}
            </div>
          </div>

          {/* Right auth card */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-amber-100 bg-white/85 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur">
              {/* subtle glow */}
              <div
                aria-hidden
                className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl"
              />

              <div className="relative">
                <div className="mb-8 space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                    🔥
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-neutral-900">
                      Entrar
                    </h2>

                    <p className="text-neutral-600">
                      Continue cozinhando experiências no Queimando Panela.
                    </p>
                  </div>
                </div>

                <SignInForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

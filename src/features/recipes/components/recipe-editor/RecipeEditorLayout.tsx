import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function RecipeEditorLayout({
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <main className="min-h-dvh bg-neutral-50 pb-20 text-neutral-900">
      <div className="border-b border-neutral-200 bg-white">
        <div className="editorial-container py-4 sm:py-5">
          <Link
            href="/receitas"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-amber-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para receitas
          </Link>
        </div>
      </div>

      <section className="border-b border-neutral-200 bg-white">
        <div className="editorial-container py-8 sm:py-10 lg:py-12">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-amber-700 uppercase">
              {eyebrow}
            </p>

            <h1 className="text-4xl leading-tight font-bold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="max-w-2xl text-base leading-7 text-neutral-700 sm:text-lg">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section className="editorial-container py-8 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div>{children}</div>

          <aside className="h-fit border border-neutral-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-3 text-sm font-bold tracking-[0.16em] text-neutral-900 uppercase">
              Antes de salvar
            </h2>

            <ul className="space-y-3 text-sm leading-6 text-neutral-700">
              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 bg-amber-500"
                />
                Revise título, ingredientes e modo de preparo.
              </li>
              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 bg-amber-500"
                />
                Use a análise da IA como rascunho editável, não como resposta
                final.
              </li>
              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 bg-amber-500"
                />
                Receitas salvas ficam como não publicadas até sua revisão final.
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}

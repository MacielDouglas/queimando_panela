import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

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
    <main className="bg-white pb-12">
      <div className="h-[6px] bg-[#ffb900]" aria-hidden="true" />
      <div className="border-b-2 border-[#0a0a0a] bg-white">
        <div className="editorial-container py-3">
          <Link
            href="/receitas"
            className="inline-flex h-10 items-center gap-2 border-2 border-[#e5e5e5] bg-white px-3 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:border-[#0a0a0a] hover:bg-[#ffb900]"
          >
            <ChevronLeft className="size-4" />
            Voltar
          </Link>
        </div>
      </div>

      <section className="border-b-2 border-[#0a0a0a] bg-white">
        <div className="editorial-container py-8 lg:py-10">
          <div className="max-w-3xl">
            <p className="inline-block bg-[#ffb900] border-2 border-[#0a0a0a] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
              {eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-[#0a0a0a] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl border-l-[6px] border-[#ffb900] pl-4 font-sans text-sm leading-6 text-[#6b6b6b]">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section className="editorial-container py-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>{children}</div>
          <aside className="h-fit border-2 border-[#0a0a0a] bg-[#0a0a0a] p-4 text-white lg:sticky lg:top-[76px]">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-[#ffb900]">
              Antes de salvar
            </h2>
            <ul className="mt-3 space-y-2 font-sans text-sm leading-5 text-white/70">
              <li className="flex gap-2">
                <span
                  className="mt-2 size-1.5 bg-[#ffb900] shrink-0"
                  aria-hidden="true"
                />
                Revise título e ingredientes.
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-2 size-1.5 bg-[#ffb900] shrink-0"
                  aria-hidden="true"
                />
                IA é rascunho editável.
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-2 size-1.5 bg-[#ffb900] shrink-0"
                  aria-hidden="true"
                />
                Salvo fica não publicado até revisão.
              </li>
            </ul>
            <div className="mt-4 h-1 bg-[#ffb900]" aria-hidden="true" />
          </aside>
        </div>
      </section>
    </main>
  );
}

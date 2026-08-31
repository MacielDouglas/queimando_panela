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
    <main style={{ background: 'var(--cream)' }} className="pb-12">
      {/* Breadcrumb editorial — mesmo padrão de /receitas/[slug] */}
      <div className="editorial-container pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs"
        >
          <Link
            href="/"
            className="transition-colors hover:opacity-80"
            style={{ color: 'var(--ink-muted)' }}
          >
            Home
          </Link>
          <span style={{ color: 'var(--line)' }}>/</span>
          <Link
            href="/receitas"
            className="transition-colors hover:opacity-80"
            style={{ color: 'var(--ink-muted)' }}
          >
            Receitas
          </Link>
          <span style={{ color: 'var(--line)' }}>/</span>
          <span className="font-bold" style={{ color: 'var(--cocoa)' }}>
            {eyebrow}
          </span>
        </nav>
      </div>

      {/* Voltar — pill editorial */}
      <div className="editorial-container pt-4">
        <Link
          href="/receitas"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border bg-white px-3.5 text-[0.78rem] font-bold uppercase transition-colors hover:opacity-90"
          style={{
            borderColor: 'var(--line)',
            color: 'var(--cocoa)',
            letterSpacing: '0.06em',
          }}
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Voltar para receitas
        </Link>
      </div>

      {/* Hero editorial — mesmo padrão de /receitas (eyebrow + title + copy + qp-mark) */}
      <section
        className="qp-reveal mt-6 border-y bg-white"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="editorial-container py-12 lg:py-16">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.78rem] font-bold uppercase"
              style={{
                borderColor: 'var(--line)',
                background: 'white',
                color: 'var(--cocoa)',
                letterSpacing: '0.08em',
              }}
            >
              <span
                className="grid size-6 place-items-center rounded-full text-[0.7rem] font-extrabold"
                style={{
                  background: 'var(--food-accent)',
                  color: 'var(--cocoa)',
                }}
                aria-hidden="true"
              >
                QP
              </span>
              Queimando Panela
            </span>
            <span
              className="hidden items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[0.78rem] font-bold uppercase sm:inline-flex"
              style={{
                borderColor: 'var(--line)',
                color: 'var(--cocoa)',
                letterSpacing: '0.08em',
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: 'var(--food-accent)' }}
                aria-hidden="true"
              />
              Rascunho editável
            </span>
          </div>

          <p className="eyebrow-queimando-panela mt-8">{eyebrow}</p>
          <h1 className="section-title-queimando-panela max-w-[20ch] text-balance">
            {title}
          </h1>
          <p className="section-copy">{description}</p>
        </div>
      </section>

      {/* Grid editorial — mesmo ritmo de /receitas (1fr + 320px) */}
      <div className="editorial-container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="min-w-0 qp-reveal">{children}</div>

          <aside className="space-y-4 lg:sticky lg:top-[96px]">
            {/* Card principal — branco, radius-md, line, header com traço amarelo */}
            <div
              className="qp-reveal overflow-hidden bg-white"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
              }}
            >
              <div
                className="bg-white px-5 py-4"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-1 w-8"
                    style={{ background: 'var(--food-accent)' }}
                    aria-hidden="true"
                  />
                  <p
                    className="text-[0.78rem] font-bold uppercase"
                    style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
                  >
                    Antes de salvar
                  </p>
                </div>
                <p
                  className="mt-2 text-xs leading-5"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  Revise com calma — a IA sugere, você decide.
                </p>
              </div>

              <ul className="space-y-3 p-5">
                {[
                  'Revise título e ingredientes.',
                  'IA é rascunho editável.',
                  'Salvo fica não publicado até revisão.',
                ].map((text) => (
                  <li key={text} className="flex gap-2.5 text-sm leading-5">
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full"
                      style={{ background: 'var(--food-accent)' }}
                      aria-hidden="true"
                    />
                    <span style={{ color: 'var(--ink-muted)' }}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card dica — muted, mesmo padrão de /receitas sidebar */}
            <div
              className="qp-reveal p-5"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
                background: 'var(--muted)',
              }}
            >
              <p
                className="text-[0.78rem] font-bold uppercase"
                style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
              >
                Dica
              </p>
              <p
                className="mt-2 text-sm leading-6"
                style={{ color: 'var(--ink-muted)', textWrap: 'pretty' }}
              >
                A primeira foto vira capa. Capriche na luz natural e no prato já
                servido — a leitura agradece.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

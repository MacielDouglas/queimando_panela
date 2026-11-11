import { ArrowUpRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { LegalPrintButton } from '@/components/legal/legal-print-button';
import {
  LegalTableOfContents,
  type LegalTocItem,
} from '@/components/legal/legal-table-of-contents';

export type LegalSummaryItem = {
  label: string;
  text: string;
};

type LegalDocumentShellProps = {
  documentLabel: string;
  title: string;
  dek: string;
  version: string;
  updatedAt: string;
  readingTime: string;
  summary: LegalSummaryItem[];
  toc: LegalTocItem[];
  otherDocument: {
    href: string;
    label: string;
    description: string;
  };
  children: ReactNode;
};

export function LegalDocumentShell({
  documentLabel,
  title,
  dek,
  version,
  updatedAt,
  readingTime,
  summary,
  toc,
  otherDocument,
  children,
}: LegalDocumentShellProps) {
  return (
    <main>
      <header className="relative overflow-hidden bg-[var(--cocoa-dark)] text-cream print:bg-white">
        <div className="editorial-container relative pt-10 pb-12 lg:pt-14 lg:pb-16">
          <nav
            aria-label="Você está aqui"
            className="legal-print-hide flex flex-wrap items-center gap-2 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.13em] text-cream/55"
          >
            <Link
              href="/"
              className="transition-colors hover:text-[var(--gold)]"
            >
              Início
            </Link>
            <span aria-hidden="true" className="text-cream/30">
              /
            </span>
            <span className="text-cream/80">{documentLabel}</span>
          </nav>

          <div className="mt-9 grid gap-9 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2 border border-cream/25 px-3 py-1.5 font-sans text-[0.66rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)] print:hidden">
                <span
                  aria-hidden="true"
                  className="size-1.5 bg-[var(--gold)]"
                />
                Documento oficial
              </p>

              <h1 className="mt-5 max-w-[15ch] font-display text-[clamp(2.8rem,6.5vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.035em] text-cream text-balance print:text-[var(--cocoa)]">
                {title}
              </h1>

              <p className="mt-6 max-w-[58ch] hyphens-none text-[1.02rem] leading-[1.7] text-cream/75 print:text-[var(--ink-muted)]">
                {dek}
              </p>

              <p className="mt-4 hidden font-sans text-[0.76rem] font-semibold uppercase tracking-[0.1em] text-[var(--ink-muted)] print:block">
                Versão {version} · atualizada em {updatedAt} · leitura de{' '}
                {readingTime}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-cream/15 pt-5 lg:grid-cols-1 lg:gap-y-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 print:hidden">
              <div>
                <dt className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.15em] text-cream/45">
                  Versão
                </dt>
                <dd className="mt-1 font-display text-[1.1rem] font-semibold text-cream">
                  {version}
                </dd>
              </div>
              <div>
                <dt className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.15em] text-cream/45">
                  Atualizado em
                </dt>
                <dd className="mt-1 text-[0.9rem] leading-snug text-cream/85">
                  {updatedAt}
                </dd>
              </div>
              <div>
                <dt className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.15em] text-cream/45">
                  Tempo de leitura
                </dt>
                <dd className="mt-1 text-[0.9rem] leading-snug text-cream/85">
                  {readingTime}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="relative border-t border-cream/10 print:hidden">
          <div className="editorial-container grid gap-px bg-cream/15 md:grid-cols-3">
            {summary.map((item) => (
              <div
                key={item.label}
                className="bg-[var(--cocoa-dark)] px-5 py-5 sm:px-6"
              >
                <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.15em] text-[var(--gold)]">
                  {item.label}
                </p>
                <p className="mt-2 max-w-[34ch] hyphens-none text-[0.92rem] leading-snug text-cream/80">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="editorial-container grid gap-10 py-12 lg:grid-cols-[minmax(180px,230px)_minmax(0,1fr)] lg:gap-16 lg:py-16 print:grid-cols-1 print:gap-0 print:py-0">
        <aside className="legal-print-hide hidden lg:block">
          <div className="sticky top-[108px] max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2">
            <LegalTableOfContents items={toc} />

            <div className="mt-9 border-t border-line pt-6">
              <p className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                Continue lendo
              </p>
              <Link
                href={otherDocument.href}
                className="mt-3 inline-flex items-start gap-2 font-display text-[1.05rem] font-semibold leading-snug text-[var(--cocoa)] transition-colors hover:text-[var(--clay)]"
              >
                {otherDocument.label}
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0"
                />
              </Link>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-[var(--ink-muted)]">
                {otherDocument.description}
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <details className="group mb-8 border border-line bg-white/45 lg:hidden print:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-sans text-[0.72rem] font-bold uppercase tracking-[0.13em] text-[var(--cocoa)] [&::-webkit-details-marker]:hidden">
              Neste documento
              <ChevronDown
                aria-hidden="true"
                className="size-4 text-[var(--clay)] transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="border-t border-line px-3 pt-2 pb-4">
              <LegalTableOfContents items={toc} compact />
            </div>
          </details>

          <div className="mb-9 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
              Vigência imediata · Queimando Panela
            </p>
            <LegalPrintButton />
          </div>

          <article className="legal-copy">{children}</article>

          <footer className="mt-16 border-t border-line pt-8 print:hidden">
            <Link
              href={otherDocument.href}
              className="group flex items-start justify-between gap-6 border border-line bg-white/45 p-5 transition-colors hover:border-[var(--cocoa)] sm:p-6"
            >
              <span>
                <span className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                  Leia também
                </span>
                <span className="mt-1.5 block font-display text-[1.45rem] font-semibold leading-tight text-[var(--cocoa)]">
                  {otherDocument.label}
                </span>
                <span className="mt-2 block max-w-[52ch] text-[0.88rem] leading-relaxed text-[var(--ink-muted)]">
                  {otherDocument.description}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-[var(--clay)] transition-transform group-hover:-translate-y-0.5"
              />
            </Link>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-[0.78rem] text-[var(--ink-muted)]">
              <a
                href="#topo"
                className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-[var(--cocoa)] transition-colors hover:text-[var(--clay)]"
              >
                Voltar ao topo
                <span aria-hidden="true">↑</span>
              </a>
              <span>
                Queimando Panela · {documentLabel} versão {version} ·{' '}
                {updatedAt}
              </span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

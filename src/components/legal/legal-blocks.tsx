import {
  ArrowLeftRight,
  Info,
  Mail,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import type { ReactNode } from 'react';

// ─── Section ──────────────────────────────────────────────────────────────────

type LegalSectionProps = {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
};

export function LegalSection({
  id,
  index,
  title,
  children,
}: LegalSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-line pt-9 first:border-t-0 first:pt-0 sm:pt-10"
    >
      <header className="flex items-baseline gap-3 sm:gap-4">
        <span
          aria-hidden="true"
          className="font-display text-[0.95rem] font-semibold tabular-nums text-[var(--clay)]"
        >
          {index}
        </span>
        <h2 className="font-display text-[clamp(1.6rem,2.8vw,2.15rem)] font-semibold leading-[1.13] tracking-[-0.025em] text-[var(--cocoa)]">
          {title}
        </h2>
      </header>

      <div className="legal-copy mt-4 sm:pl-[2.9rem]">{children}</div>
    </section>
  );
}

// ─── Callout ─────────────────────────────────────────────────────────────────

type CalloutTone = 'note' | 'warning' | 'safe';

type LegalCalloutProps = {
  tone?: CalloutTone;
  title: string;
  children: ReactNode;
};

const calloutTones = {
  note: {
    background: 'var(--paper-strong)',
    border: 'var(--line)',
    accent: 'var(--clay)',
    Icon: Info,
  },
  warning: {
    background: 'var(--warning-soft)',
    border: 'var(--warning-border)',
    accent: 'var(--warning)',
    Icon: TriangleAlert,
  },
  safe: {
    background: 'var(--success-soft)',
    border: 'var(--success-border)',
    accent: 'var(--success)',
    Icon: ShieldCheck,
  },
} as const;

export function LegalCallout({
  tone = 'note',
  title,
  children,
}: LegalCalloutProps) {
  const config = calloutTones[tone];
  const Icon = config.Icon;

  return (
    <aside
      className="legal-callout my-7 border p-5 sm:p-6"
      style={{ background: config.background, borderColor: config.border }}
    >
      <p className="flex items-center gap-2.5 font-sans text-[0.74rem] font-bold uppercase tracking-[0.13em] text-[var(--cocoa)]">
        <Icon
          aria-hidden="true"
          className="size-[18px] shrink-0"
          style={{ color: config.accent }}
        />
        {title}
      </p>
      <div className="mt-2.5">{children}</div>
    </aside>
  );
}

// ─── Steps ───────────────────────────────────────────────────────────────────

export type LegalStep = {
  title: string;
  body: ReactNode;
};

export function LegalSteps({ steps }: { steps: LegalStep[] }) {
  return (
    <ol className="my-7 list-none divide-y divide-line border-y border-line">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="grid gap-2 py-5 sm:grid-cols-[3.25rem_1fr] sm:gap-0"
        >
          <span
            aria-hidden="true"
            className="font-display text-[1.4rem] font-semibold leading-none tabular-nums text-[var(--clay)]"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="font-display text-[1.16rem] font-semibold leading-snug text-[var(--cocoa)]">
              {step.title}
            </h3>
            <p className="mt-1.5 max-w-[64ch] hyphens-none text-[0.98rem] leading-[1.65] text-[var(--ink-muted)]">
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ─── Table ───────────────────────────────────────────────────────────────────

type LegalTableRow = {
  key: string;
  cells: ReactNode[];
};

type LegalTableProps = {
  caption: string;
  columns: string[];
  rows: LegalTableRow[];
};

export function LegalTable({ caption, columns, rows }: LegalTableProps) {
  // Tabelas com 4 colunas precisam de mais largura para o texto respirar.
  const minWidth = columns.length >= 4 ? 'min-w-[820px]' : 'min-w-[640px]';

  return (
    <div className="legal-table my-7 border border-line">
      <p className="legal-table-hint flex items-center gap-2 border-b border-line px-4 py-2 text-[0.75rem] leading-normal text-[var(--ink-muted)] xl:hidden">
        <ArrowLeftRight aria-hidden="true" className="size-3.5 shrink-0" />
        Deslize a tabela para o lado para ver todas as colunas.
      </p>
      {/* Região rolável precisa receber foco para rolagem por teclado. */}
      <section
        className="legal-table-scroll overflow-x-auto"
        aria-label={caption}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: região rolável precisa receber foco para rolagem por teclado
        tabIndex={0}
      >
        <table
          className={`legal-table-content w-full ${minWidth} border-collapse text-left align-top text-[0.88rem] leading-[1.55]`}
        >
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-[var(--cocoa)] text-cream">
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-3 font-sans text-[0.66rem] font-bold uppercase tracking-[0.12em]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row.key}
                className={
                  rowIndex % 2 === 0
                    ? 'bg-white/55'
                    : 'bg-[var(--paper-strong)]/55'
                }
              >
                {row.cells.map((cell, cellIndex) => {
                  const cellKey = `${row.key}-${cellIndex}`;

                  if (cellIndex === 0) {
                    return (
                      <th
                        key={cellKey}
                        scope="row"
                        className="border-t border-line px-4 py-3.5 text-left align-top font-semibold text-[var(--cocoa)]"
                      >
                        {cell}
                      </th>
                    );
                  }

                  return (
                    <td
                      key={cellKey}
                      className="border-t border-line px-4 py-3.5 align-top text-[var(--ink-muted)]"
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export const LEGAL_CONTACT_EMAIL = 'contato@queimandopanela.com.br';

type LegalContactProps = {
  title?: string;
  children?: ReactNode;
  note?: string;
};

export function LegalContact({
  title = 'Ficou com dúvida?',
  children,
  note,
}: LegalContactProps) {
  return (
    <div className="legal-contact my-8 border border-line bg-[var(--cocoa-dark)] p-6 text-cream sm:p-8">
      <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
        Contato
      </p>
      <h3 className="mt-2 font-display text-[1.55rem] font-semibold leading-tight text-cream">
        {title}
      </h3>
      {children ? (
        <div className="mt-3 max-w-[56ch] space-y-2 text-[0.95rem] leading-relaxed text-cream/75">
          {children}
        </div>
      ) : null}
      <a
        href={`mailto:${LEGAL_CONTACT_EMAIL}`}
        className="mt-5 inline-flex min-h-11 items-center gap-2 border border-cream/30 px-4 text-[0.88rem] font-bold text-cream transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
      >
        <Mail aria-hidden="true" className="size-4" />
        {LEGAL_CONTACT_EMAIL}
      </a>
      {note ? (
        <p className="mt-3 max-w-[56ch] text-[0.78rem] leading-relaxed text-cream/55">
          {note}
        </p>
      ) : null}
    </div>
  );
}

'use client';

import { Printer } from 'lucide-react';

export function LegalPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-10 items-center gap-2 border border-line bg-white/45 px-3.5 text-[0.78rem] font-semibold text-[var(--ink-muted)] transition-colors hover:border-[var(--cocoa)] hover:text-[var(--cocoa)] print:hidden"
    >
      <Printer aria-hidden="true" className="size-4" />
      Imprimir ou salvar em PDF
    </button>
  );
}

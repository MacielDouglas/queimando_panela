'use client';

import type { DiffLine } from '../hooks/use-spell-check';

type Props = {
  diffs: DiffLine[];
  onApply: () => void;
  onClose: () => void;
};

export function SpellCheckModal({ diffs, onApply, onClose }: Props) {
  const changed = diffs.filter((d) => d.changed);
  const unchanged = diffs.filter((d) => !d.changed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-stone-900">Revisão ortográfica</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              {changed.length === 0
                ? 'Nenhuma correção necessária.'
                : `${changed.length} ${changed.length === 1 ? 'campo corrigido' : 'campos corrigidos'}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            aria-label="Fechar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {changed.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="text-4xl">✅</span>
              <p className="mt-3 text-sm font-medium text-stone-700">Texto sem correções!</p>
              <p className="mt-1 text-xs text-stone-400">Ortografia e parágrafos estão corretos.</p>
            </div>
          )}

          {changed.map((diff) => (
            <div key={diff.field}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
                {diff.label}
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {/* Original */}
                <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                  <p className="mb-1.5 text-xs font-medium text-red-500">Original</p>
                  <DiffText original={diff.original} corrected={diff.corrected} side="original" />
                </div>
                {/* Corrigido */}
                <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                  <p className="mb-1.5 text-xs font-medium text-green-600">Corrigido</p>
                  <DiffText original={diff.original} corrected={diff.corrected} side="corrected" />
                </div>
              </div>
            </div>
          ))}

          {unchanged.length > 0 && changed.length > 0 && (
            <p className="text-xs text-stone-400">
              {unchanged.length}{' '}
              {unchanged.length === 1 ? 'campo sem alteração' : 'campos sem alteração'}:{' '}
              {unchanged.map((d) => d.label).join(', ')}.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-stone-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Ignorar
          </button>
          {changed.length > 0 && (
            <button
              onClick={onApply}
              className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-stone-950 transition hover:bg-amber-400"
            >
              Aplicar correções
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Diff linha por linha ─────────────────────────────────────────────────────

function DiffText({
  original,
  corrected,
  side,
}: {
  original: string;
  corrected: string;
  side: 'original' | 'corrected';
}) {
  const originalLines = original.split('\n');
  const correctedLines = corrected.split('\n');
  const maxLen = Math.max(originalLines.length, correctedLines.length);

  return (
    <div className="space-y-0.5 text-sm leading-relaxed text-stone-700">
      {Array.from({ length: maxLen }, (_, i) => {
        const orig = originalLines[i] ?? '';
        const corr = correctedLines[i] ?? '';
        const isDiff = orig.trim() !== corr.trim();

        const text = side === 'original' ? orig : corr;
        const highlight = isDiff;

        if (!text && orig === '' && corr === '') return null;

        return (
          <p
            key={i}
            className={`whitespace-pre-wrap rounded px-1 ${
              highlight
                ? side === 'original'
                  ? 'bg-red-100 text-red-700 line-through decoration-red-400'
                  : 'bg-green-100 text-green-700'
                : ''
            }`}
          >
            {text || <span className="opacity-0">—</span>}
          </p>
        );
      })}
    </div>
  );
}

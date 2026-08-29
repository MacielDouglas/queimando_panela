'use client';

import { Loader2, Trash2, X } from 'lucide-react';
import { useState, useTransition } from 'react';

import { deleteRecipe } from '@/features/recipes/actions/delete-recipe';

type Props = {
  slug: string;
  title: string;
};

export function DeleteRecipeButton({ slug, title }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    setError(null);

    startTransition(async () => {
      const result = await deleteRecipe(slug);

      if (result?.error) {
        setError(result.error);
        return;
      }

      setOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border bg-white px-4 text-sm font-bold transition hover:bg-red-50"
        style={{ borderColor: 'var(--line)', color: 'var(--destructive)' }}
      >
        <Trash2 className="h-4 w-4" />
        Excluir receita
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-md bg-white p-6"
            style={{
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2
                  className="font-display text-lg font-bold"
                  style={{ color: 'var(--forest)' }}
                >
                  Excluir receita
                </h2>
                <p
                  className="mt-2 text-sm"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  Tem certeza que deseja excluir{' '}
                  <strong style={{ color: 'var(--forest)' }}>{title}</strong>?
                  Essa ação não pode ser desfeita.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="transition hover:opacity-70"
                style={{ color: 'var(--ink-muted)' }}
                aria-label="Fechar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <p
                className="mb-4 rounded-[10px] px-3 py-2 text-sm"
                style={{
                  border:
                    '1px solid color-mix(in srgb, var(--destructive) 20%, transparent)',
                  background:
                    'color-mix(in srgb, var(--destructive) 6%, white)',
                  color: 'var(--destructive)',
                }}
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center rounded-full border bg-white px-4 text-sm font-bold transition hover:bg-[var(--muted)]"
                style={{ borderColor: 'var(--line)', color: 'var(--forest)' }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold text-white transition disabled:opacity-60"
                style={{ background: 'var(--destructive)' }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Sim, excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

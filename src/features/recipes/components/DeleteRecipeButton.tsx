'use client';

import { useState, useTransition } from 'react';
import { Loader2, Trash2, X } from 'lucide-react';

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
        className="inline-flex min-h-11 items-center justify-center gap-2 border border-red-200 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Excluir receita
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md border border-neutral-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-950">
                  Excluir receita
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  Tem certeza que deseja excluir <strong>{title}</strong>? Essa
                  ação não pode ser desfeita.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="text-neutral-500 transition hover:text-neutral-900"
                aria-label="Fechar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center border border-neutral-300 px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
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

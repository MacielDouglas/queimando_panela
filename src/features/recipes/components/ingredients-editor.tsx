'use client';

import type { ParsedIngredient } from '../types/recipe-form.types';

type Props = {
  ingredients: ParsedIngredient[];
  onChange: (updated: ParsedIngredient[]) => void;
};

export function IngredientsEditor({ ingredients, onChange }: Props) {
  if (ingredients.length === 0) {
    return <p className="text-sm text-stone-500">Nenhum ingrediente sugerido ainda.</p>;
  }

  return (
    <div className="space-y-3">
      {ingredients.map((ingredient, index) => (
        <div
          key={ingredient.id ?? index}
          className="rounded-lg border border-stone-200 bg-white p-3"
        >
          <div className="grid gap-3 md:grid-cols-[120px_160px_1fr]">
            <input
              className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-amber-500"
              value={ingredient.amount ?? ''}
              placeholder="Qtd."
              onChange={(e) => {
                const next = [...ingredients];
                next[index] = { ...ingredient, amount: e.target.value || null };
                onChange(next);
              }}
            />
            <input
              className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-amber-500"
              value={ingredient.unit ?? ''}
              placeholder="Unidade"
              onChange={(e) => {
                const next = [...ingredients];
                next[index] = { ...ingredient, unit: e.target.value || null };
                onChange(next);
              }}
            />
            <input
              className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-amber-500"
              value={ingredient.name}
              placeholder="Ingrediente"
              onChange={(e) => {
                const next = [...ingredients];
                next[index] = { ...ingredient, name: e.target.value };
                onChange(next);
              }}
            />
          </div>
          {ingredient.inferred && ingredient.suggestions?.length ? (
            <p className="mt-2 text-xs text-amber-700">
              Sugestões: {ingredient.suggestions.join(' • ')}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

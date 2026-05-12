'use client';

import type { ParsedUtensil } from '../types/recipe-form.types';

type Props = {
  utensils: ParsedUtensil[];
  onChange: (updated: ParsedUtensil[]) => void;
};

export function UtensilsEditor({ utensils, onChange }: Props) {
  if (utensils.length === 0) {
    return <p className="text-sm text-stone-500">Nenhum utensílio sugerido ainda.</p>;
  }

  return (
    <div className="space-y-2">
      {utensils.map((utensil, index) => (
        <input
          key={`${utensil.name}-${index}`}
          className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-amber-500"
          value={utensil.name}
          onChange={(e) => {
            const next = [...utensils];
            next[index] = { name: e.target.value };
            onChange(next);
          }}
        />
      ))}
    </div>
  );
}

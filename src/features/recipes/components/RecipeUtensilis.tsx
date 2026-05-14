type UtensilEntry = { utensil: { id: string; name: string } };

type Props = { utensils: UtensilEntry[] };

export function RecipeUtensils({ utensils }: Props) {
  if (!utensils.length) return null;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-stone-400">
        Utensílios
      </h2>
      <ul className="flex flex-wrap gap-2">
        {utensils.map(({ utensil }) => (
          <li
            key={utensil.id}
            className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600"
          >
            {utensil.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

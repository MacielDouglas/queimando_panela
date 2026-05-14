type Ingredient = {
  id: string;
  amount: string | null;
  unit: string | null;
  name: string;
};

type Props = { ingredients: Ingredient[] };

export function RecipeIngredients({ ingredients }: Props) {
  if (!ingredients.length) return null;

  return (
    <div className="rounded-2xl bg-amber-50 p-6">
      <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-amber-700">
        Ingredientes
      </h2>
      <ul className="space-y-3">
        {ingredients.map((ing) => (
          <li
            key={ing.id}
            className="flex items-baseline gap-2 border-b border-amber-100 pb-3 last:border-0 last:pb-0"
          >
            <span className="shrink-0 text-sm font-semibold text-stone-900">
              {[ing.amount, ing.unit].filter(Boolean).join(' ') || '—'}
            </span>
            <span className="text-sm text-stone-600">{ing.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

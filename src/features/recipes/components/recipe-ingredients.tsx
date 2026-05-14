import type { RecipeDetail } from '../actions/get-recipe';

type Props = { ingredients: RecipeDetail['ingredients'] };

export function RecipeIngredients({ ingredients }: Props) {
  if (ingredients.length === 0) return null;

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-stone-900">Ingredientes</h2>
      <ul className="space-y-2">
        {ingredients.map((ing) => (
          <li key={ing.id} className="flex gap-2 text-sm text-stone-700">
            <span className="min-w-16 text-right font-medium text-stone-900">
              {[ing.amount, ing.unit].filter(Boolean).join(' ') || '—'}
            </span>
            <span>{ing.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

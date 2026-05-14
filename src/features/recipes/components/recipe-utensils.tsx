import type { RecipeDetail } from '../actions/get-recipe';

type Props = { utensils: RecipeDetail['utensils'] };

export function RecipeUtensils({ utensils }: Props) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-stone-900">Utensílios</h2>
      <ul className="flex flex-wrap gap-2">
        {utensils.map(({ utensil }) => (
          <li
            key={utensil.id}
            className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700"
          >
            {utensil.name}
          </li>
        ))}
      </ul>
    </section>
  );
}

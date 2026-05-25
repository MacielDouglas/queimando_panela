import Link from 'next/link';
import { RecipeCard } from './RecipeCard';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

type Props = {
  utensilName: string;
  recipes: RecipeCardData[];
};

export function RecipeUtensilRow({ utensilName, recipes }: Props) {
  if (recipes.length === 0) return null;

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-neutral-200 pb-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">
            Método de preparo
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">
            {utensilName}
          </h2>
        </div>

        <Link
          href={`/receitas?utensilio=${encodeURIComponent(utensilName)}`}
          className="shrink-0 text-xs font-semibold text-neutral-700 hover:text-neutral-500"
        >
          Ver todas →
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} aspectRatio="16/9" />
        ))}
      </div>
    </section>
  );
}

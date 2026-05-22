import { RecipeCard } from './RecipeCard';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

type Props = {
  type: string;
  recipes: RecipeCardData[];
};

export function RecipeCategoryRow({ type, recipes }: Props) {
  if (recipes.length === 0) return null;

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-neutral-200 pb-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase">
            Categoria
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">
            {type}
          </h2>
        </div>
        <a
          href={`/receitas?tipo=${encodeURIComponent(type)}`}
          className="shrink-0 text-xs font-semibold text-amber-700 hover:text-amber-500"
        >
          Ver todas →
        </a>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} aspectRatio="3/4" />
        ))}
      </div>
    </section>
  );
}

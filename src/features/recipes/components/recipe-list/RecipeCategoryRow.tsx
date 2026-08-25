import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import { RecipeCard } from './RecipeCard';

type Props = {
  type: string;
  recipes: RecipeCardData[];
};

export function RecipeCategoryRow({ type, recipes }: Props) {
  if (recipes.length === 0) return null;
  return (
    <section className="border-2 border-[#0a0a0a] bg-white p-4">
      <div className="mb-4 flex items-end justify-between gap-4 border-b-2 border-[#0a0a0a] pb-3">
        <div>
          <p className="inline-block bg-[#ffb900] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
            Categoria
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase leading-none text-[#0a0a0a]">
            {type}
          </h2>
        </div>
        <Link
          href={`/receitas?tipo=${encodeURIComponent(type)}`}
          className="border-2 border-[#0a0a0a] bg-white px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
        >
          Ver todas →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

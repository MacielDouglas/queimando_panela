import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import { RecipeCard } from './RecipeCard';

type Props = {
  utensilName: string;
  recipes: RecipeCardData[];
};

export function RecipeUtensilRow({ utensilName, recipes }: Props) {
  if (recipes.length === 0) return null;
  return (
    <section className="border-2 border-[#0a0a0a] bg-[#f5f5f5] p-4">
      <div className="mb-4 flex items-end justify-between gap-4 border-b-2 border-[#0a0a0a] pb-3">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
            Método
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold uppercase leading-none text-[#0a0a0a]">
            {utensilName}
          </h2>
        </div>
        <Link
          href={`/receitas?utensilio=${encodeURIComponent(utensilName)}`}
          className="border border-[#e5e5e5] bg-white px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:border-[#0a0a0a]"
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

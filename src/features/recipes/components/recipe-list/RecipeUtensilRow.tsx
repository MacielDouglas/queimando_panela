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
    <section className="overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-[#f5f5f5]">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5e5] bg-white px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-[#ffb900]" aria-hidden />
            <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-[#6b6b6b]">
              Utensílio
            </p>
          </div>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase leading-none tracking-[-0.015em] text-[#0a0a0a] text-wrap-balance">
            {utensilName}
          </h2>
        </div>
        <Link
          href={`/receitas?utensilio=${encodeURIComponent(utensilName)}`}
          className="group inline-flex items-center gap-1 rounded-full border border-[#e5e5e5] bg-white px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-[0.08em] text-[#0a0a0a] transition-colors hover:border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900]"
        >
          Ver todas{' '}
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

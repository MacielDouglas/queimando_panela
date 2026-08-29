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
    <section
      className="qp-card-delight overflow-hidden"
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--line)',
        background: 'var(--muted)',
      }}
    >
      <div
        className="flex flex-wrap items-end justify-between gap-4 bg-white px-5 py-4"
        style={{ borderBottom: '1px solid var(--line)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-1 w-8"
              style={{ background: 'var(--food-accent)' }}
              aria-hidden
            />
            <p
              className="text-[0.78rem] font-bold uppercase"
              style={{ color: 'var(--ink-muted)', letterSpacing: '0.08em' }}
            >
              Utensílio
            </p>
          </div>
          <h2
            className="mt-2 font-display text-xl font-extrabold leading-none tracking-[-0.015em] text-balance"
            style={{ color: 'var(--cocoa)' }}
          >
            {utensilName}
          </h2>
        </div>
        <Link
          href={`/receitas?utensilio=${encodeURIComponent(utensilName)}`}
          className="text-link-queimando-panela"
        >
          Ver todas
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

import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import CardRecipe from './CardRecipe';

interface LatestRecipesSectionProps {
  recipes: RecipeCardData[];
}

export function LatestRecipesSection({ recipes }: LatestRecipesSectionProps) {
  if (recipes.length === 0) {
    return (
      <section aria-labelledby="latest-recipes-title" className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-8 border-b border-neutral-200 pb-5">
            <p className="text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase">Últimas receitas</p>
            <h2 id="latest-recipes-title" className="mt-1 text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">O que acabou de sair do forno</h2>
          </header>
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-neutral-100" aria-hidden="true">
              <svg className="size-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-600">Nenhuma receita publicada ainda.</p>
            <p className="mt-1 text-sm text-neutral-400">As últimas receitas da comunidade aparecerão aqui.</p>
          </div>
        </div>
      </section>
    );
  }

  // Mostra no máximo 8 receitas para manter o grid limpo
  const visible = recipes.slice(0, 8);

  return (
    <section
      aria-labelledby="latest-recipes-title"
      className="py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da seção */}
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase">
              Últimas receitas
            </p>
            <h2
              id="latest-recipes-title"
              className="mt-1 text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl"
            >
              O que acabou de sair do forno
            </h2>
          </div>

          <Link
            href="/receitas"
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-700 transition-colors hover:text-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </header>

        {/* Grade com destaque no primeiro card — 2 cols mobile → 3 tablet → 4 desktop */}
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
        >
          {visible.map((recipe, index) => (
            <li
              key={recipe.id}
              className={index === 0 ? 'lg:col-span-2 lg:row-span-1' : ''}
            >
              <CardRecipe recipe={recipe} priority={index < 4} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

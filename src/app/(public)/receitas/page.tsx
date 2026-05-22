import type { Metadata } from 'next';
import { ChefHat, Plus } from 'lucide-react';
import Link from 'next/link';

import { getServerSession } from '@/lib/get-server-session';
import { getAllRecipes } from '@/features/recipes/actions/get-all-recipes';
import {
  normalizeString,
  normalizeDifficulty,
} from '@/features/recipes/lib/recipe-params';
import { getLatestRecipe } from '@/features/recipes/actions/get-latest-recipe';
import { getRecipesByCategory } from '@/features/recipes/actions/get-recipes-by-category';
import { getRecipesByUtensil } from '@/features/recipes/actions/get-recipe-by-utensil';

import { RecipeHeroFeatured } from '@/features/recipes/components/recipe-list/RecipeHeroFeatured';
import { RecipeSearch } from '@/features/recipes/components/recipe-list/RecipeSearch';
import { RecipeFilters } from '@/features/recipes/components/recipe-list/RecipeFilters';
import { RecipeCategoryRow } from '@/features/recipes/components/recipe-list/RecipeCategoryRow';
import { RecipeUtensilRow } from '@/features/recipes/components/recipe-list/RecipeUtensilRow';
import { RecipeGrid } from '@/features/recipes/components/recipe-list/RecipeGrid';

type SearchValue = string | string[] | undefined;

type Props = {
  searchParams: Promise<{
    q?: SearchValue;
    tipo?: SearchValue;
    dificuldade?:
      | 'EASY'
      | 'MEDIUM'
      | 'HARD'
      | Array<'EASY' | 'MEDIUM' | 'HARD'>;
    utensilio?: SearchValue;
    page?: SearchValue;
  }>;
};

export const metadata: Metadata = {
  title: 'Receitas da comunidade — Queimando Panela',
  description:
    'Receitas caseiras, afetivas e compartilhadas pela comunidade do Queimando Panela.',
};

export default async function RecipesPage({ searchParams }: Props) {
  const session = await getServerSession();
  const params = await searchParams;

  const query = normalizeString(params.q);
  const type = normalizeString(params.tipo);
  const difficulty = normalizeDifficulty(params.dificuldade);
  const utensil = normalizeString(params.utensilio);
  const rawPage = normalizeString(params.page);
  const currentPage = Math.max(Number(rawPage ?? '1'), 1);
  const take = 24;
  const skip = (currentPage - 1) * take;

  const isFiltered = !!(query || type || difficulty || utensil);

  const [latest, categoryRows, utensilRows, allRecipesResult] =
    await Promise.all([
      isFiltered ? Promise.resolve(null) : getLatestRecipe(),
      isFiltered ? Promise.resolve([]) : getRecipesByCategory(4),
      isFiltered ? Promise.resolve([]) : getRecipesByUtensil(4),
      getAllRecipes({
        query,
        type,
        difficulty,
        utensilName: utensil,
        take,
        skip,
      }),
    ]);

  const { recipes, total } = allRecipesResult;
  const totalPages = Math.max(Math.ceil(total / take), 1);

  return (
    <main className="min-h-dvh bg-neutral-50 pb-20 text-neutral-900">
      <section className="border-b border-neutral-200 bg-white">
        <div className="editorial-container py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex min-h-9 items-center gap-2 border border-amber-500 bg-amber-50 px-4 text-xs font-semibold tracking-[0.16em] text-amber-700 uppercase">
                <ChefHat className="h-4 w-4" />
                Receitas feitas por cozinheiros amadores
              </span>
            </div>

            {session?.user && (
              <Link
                href="/receitas/new"
                className="inline-flex min-h-10 items-center gap-2 border border-amber-500 bg-amber-500 px-4 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400"
              >
                <Plus className="h-4 w-4" />
                Enviar nova receita
              </Link>
            )}
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl leading-tight font-bold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
            Receitas para aquecer a alma e a cozinha.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">
            Descubra pratos criados por cozinheiros amadores, receitas afetivas,
            sabores regionais e experiências gastronômicas compartilhadas pela
            comunidade.
          </p>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-neutral-950">
        <div className="editorial-container py-6 sm:py-8">
          <RecipeSearch defaultQuery={query} />
        </div>
      </section>

      <div className="editorial-container py-8 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-10">
          <div className="min-w-0 space-y-14">
            {!isFiltered && latest && (
              <section>
                <RecipeHeroFeatured recipe={latest} />
              </section>
            )}

            {!isFiltered &&
              categoryRows.map((row) => (
                <RecipeCategoryRow
                  key={row.type}
                  type={row.type}
                  recipes={row.recipes}
                />
              ))}

            {!isFiltered &&
              utensilRows.map((row) => (
                <RecipeUtensilRow
                  key={row.utensilName}
                  utensilName={row.utensilName}
                  recipes={row.recipes}
                />
              ))}

            <RecipeGrid
              recipes={recipes}
              total={total}
              currentPage={currentPage}
              totalPages={totalPages}
              q={query}
              tipo={type}
              dificuldade={difficulty}
              utensilio={utensil}
            />
          </div>

          <aside className="lg:sticky lg:top-24">
            <RecipeFilters
              currentQuery={query}
              currentType={type}
              currentDifficulty={difficulty}
              currentUtensil={utensil}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

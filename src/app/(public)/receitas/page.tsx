import { ChefHat, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

import { getAllRecipes } from '@/features/recipes/actions/get-all-recipes';
import { getLatestRecipe } from '@/features/recipes/actions/get-latest-recipe';
import { getRecipesByUtensil } from '@/features/recipes/actions/get-recipe-by-utensil';
import { getRecipeFilterOptions } from '@/features/recipes/actions/get-recipe-filter-options';
import { getRecipesByCategory } from '@/features/recipes/actions/get-recipes-by-category';
import { RecipeCategoryRow } from '@/features/recipes/components/recipe-list/RecipeCategoryRow';
import { RecipeFilters } from '@/features/recipes/components/recipe-list/RecipeFilters';
import { RecipeGrid } from '@/features/recipes/components/recipe-list/RecipeGrid';
import { RecipeHeroFeatured } from '@/features/recipes/components/recipe-list/RecipeHeroFeatured';
import { RecipeSearch } from '@/features/recipes/components/recipe-list/RecipeSearch';
import { RecipeUtensilRow } from '@/features/recipes/components/recipe-list/RecipeUtensilRow';
import { normalizeString } from '@/features/recipes/lib/recipe-params';
import type { RecipeDifficultyValue } from '@/features/recipes/types/recipe.types';
import { getServerSession } from '@/lib/get-server-session';

type SearchValue = string | string[] | undefined;

type Props = {
  searchParams: Promise<{
    q?: SearchValue;
    categoria?: SearchValue;
    tipo?: SearchValue;
    dificuldade?: RecipeDifficultyValue | RecipeDifficultyValue[];
    utensilio?: SearchValue;
    ingrediente?: SearchValue;
    page?: SearchValue;
  }>;
};

export const metadata: Metadata = {
  title: 'Receitas — Queimando Panela',
  description:
    'Todas as receitas Queimando Panela — quadradas, amarelas e sem frescura.',
};

function getSingle(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

function getMany(value: SearchValue) {
  if (!value) return [];
  return Array.isArray(value)
    ? value.map((item) => item.trim()).filter(Boolean)
    : [value.trim()].filter(Boolean);
}

function parseDifficulty(
  value: SearchValue,
): RecipeDifficultyValue | undefined {
  const raw = getSingle(value);
  if (
    raw === 'EASY' ||
    raw === 'EASY_MEDIUM' ||
    raw === 'MEDIUM' ||
    raw === 'MEDIUM_HARD' ||
    raw === 'HARD'
  ) {
    return raw;
  }
  return undefined;
}

export default async function RecipesPage({ searchParams }: Props) {
  const session = await getServerSession();
  const params = await searchParams;

  const query = normalizeString(params.q);
  const category = normalizeString(getSingle(params.categoria));
  const types = getMany(params.tipo);
  const difficulty = parseDifficulty(params.dificuldade);
  const utensils = getMany(params.utensilio);
  const ingredients = getMany(params.ingrediente);
  const rawPage = normalizeString(params.page);
  const currentPage = Math.max(Number(rawPage ?? '1'), 1);
  const take = 24;
  const skip = (currentPage - 1) * take;

  const isFiltered = !!(
    query ||
    category ||
    difficulty ||
    types.length > 0 ||
    utensils.length > 0 ||
    ingredients.length > 0
  );

  const [latest, categoryRows, utensilRows, allRecipesResult, filterOptions] =
    await Promise.all([
      isFiltered ? Promise.resolve(null) : getLatestRecipe(),
      isFiltered ? Promise.resolve([]) : getRecipesByCategory(4),
      isFiltered ? Promise.resolve([]) : getRecipesByUtensil(4),
      getAllRecipes({
        query,
        category,
        types,
        difficulty,
        utensils,
        ingredients,
        take,
        skip,
      }),
      getRecipeFilterOptions(),
    ]);

  const { recipes, total } = allRecipesResult;
  const totalPages = Math.max(Math.ceil(total / take), 1);

  return (
    <main className="bg-white">
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="editorial-container py-12 lg:py-16">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a] shadow-sm">
                <span className="grid size-6 place-items-center rounded-full bg-[#ffb900]">
                  <ChefHat className="size-3.5" />
                </span>
                Queimando Panela
              </span>
              <span
                className="hidden h-6 w-px bg-[#e5e5e5] sm:block"
                aria-hidden="true"
              />
              <span className="hidden font-sans text-xs font-medium tracking-wide text-[#6b6b6b] sm:inline">
                {total} {total === 1 ? 'receita' : 'receitas'} • curadoria lenta
              </span>
            </div>

            {session?.user && (
              <Link
                href="/receitas/new"
                className="inline-flex min-h-11 items-center gap-2 rounded-none border-2 border-[#0a0a0a] bg-[#0a0a0a] px-5 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2"
              >
                <Plus className="size-4" />
                Enviar receita
              </Link>
            )}
          </div>

          <h1 className="mt-8 max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-[#0a0a0a] sm:text-5xl text-wrap-balance">
            Receitas para
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">aquecer</span>
              <span
                className="absolute inset-x-0 bottom-1 h-[0.45em] bg-[#ffb900]/60"
                aria-hidden
              />
            </span>{' '}
            a cozinha.
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
            Leitura leve, foto grande e filtros que respeitam sua escolha.
            Escolha categoria, dificuldade ou ingrediente — a página responde
            com calma.
          </p>
        </div>
      </section>

      <section className="border-y border-[#e5e5e5] bg-[#f5f5f5]">
        <div className="editorial-container py-6">
          <div className="flex items-center gap-4">
            <span className="hidden shrink-0 items-center gap-2 bg-white px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a] ring-1 ring-[#e5e5e5] sm:inline-flex">
              <span className="size-1.5 bg-[#ffb900]" aria-hidden />
              Busca
            </span>
            <div className="flex-1">
              <RecipeSearch defaultQuery={query} />
            </div>
            <Link
              href="/receitas"
              className="hidden min-h-11 shrink-0 items-center justify-center rounded-none border border-[#e5e5e5] bg-white px-5 font-display text-xs font-bold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:border-[#0a0a0a] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] sm:inline-flex"
            >
              Limpar
            </Link>
          </div>
        </div>
      </section>

      <div className="editorial-container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="min-w-0 space-y-10">
            {!isFiltered && latest && (
              <section className="overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white p-2 shadow-sm">
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
              categoria={category}
              tipo={types}
              dificuldade={difficulty}
              utensilio={utensils}
              ingrediente={ingredients}
            />
          </div>

          <aside className="lg:sticky lg:top-[76px] space-y-4">
            <div className="overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white">
              <div className="border-b border-[#e5e5e5] bg-white px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-1 w-8 bg-[#ffb900]" aria-hidden />
                  <p className="font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
                    Filtros
                  </p>
                </div>
                <p className="mt-2 font-sans text-xs leading-5 text-[#6b6b6b]">
                  Combine categoria, dificuldade e ingredientes com calma.
                </p>
              </div>
              <div className="p-4">
                <RecipeFilters
                  currentQuery={query}
                  currentCategory={category}
                  currentDifficulty={difficulty ?? ''}
                  currentTypes={types}
                  currentUtensils={utensils}
                  currentIngredients={ingredients}
                  categories={filterOptions.categories}
                  types={filterOptions.types}
                  utensils={filterOptions.utensils}
                  ingredients={filterOptions.ingredients}
                />
              </div>
            </div>

            <div className="rounded-[12px] border border-[#e5e5e5] bg-[#f5f5f5] p-5">
              <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
                Dica
              </p>
              <p className="mt-2 font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
                O chip amarelo indica filtro ativo. Clique novamente para
                remover — a página recarrega leve, sem pular.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

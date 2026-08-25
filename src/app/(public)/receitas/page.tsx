import { ChefHat, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

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
      {/* Faixa Queimando Panela */}
      {/* Header Queimando Panela */}
      <section className="border-b-2 border-[#0a0a0a] bg-white">
        <div className="editorial-container py-12 lg:py-16">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 border-2 border-[#0a0a0a] bg-[#ffb900] px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
                <ChefHat className="size-4" />
                Queimando Panela
              </span>
              <span
                className="hidden h-6 w-px bg-[#e5e5e5] sm:block"
                aria-hidden="true"
              />
              <span className="hidden font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b] sm:inline">
                {total} receitas
              </span>
            </div>

            {session?.user && (
              <Link
                href="/receitas/new"
                className="inline-flex h-11 items-center gap-2 border-2 border-[#0a0a0a] bg-[#0a0a0a] px-5 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white hover:bg-[#ffb900] hover:text-[#0a0a0a]"
              >
                <Plus className="size-4" />
                Enviar receita
              </Link>
            )}
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-[#0a0a0a] sm:text-5xl">
            Receitas para
            <br />
            <span className="bg-[#ffb900] px-1">aquecer</span> a cozinha.
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-sm leading-6 text-[#6b6b6b]">
            Grid Queimando Panela 3 colunas, filtro Queimando Panela quadrado.
            Clique no chip, a página recarrega quadrada.
          </p>
        </div>
      </section>

      {/* Busca — faixa preta Queimando Panela */}
      <section className="border-b-2 border-[#0a0a0a] bg-[#0a0a0a]">
        <div className="editorial-container py-6">
          <div className="flex items-center gap-3">
            <span className="hidden bg-[#ffb900] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] sm:inline-block">
              Busca
            </span>
            <div className="flex-1">
              <RecipeSearch defaultQuery={query} />
            </div>
            <Link
              href="/receitas"
              className="hidden h-12 items-center border border-white/20 px-4 font-display text-xs font-bold uppercase tracking-[0.12em] text-white hover:border-[#ffb900] hover:text-[#ffb900] sm:inline-flex"
            >
              Limpar
            </Link>
          </div>
        </div>
      </section>

      <div className="editorial-container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="min-w-0 space-y-10">
            {!isFiltered && latest && (
              <section className="border-2 border-[#0a0a0a] bg-white p-2">
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

          <aside className="lg:sticky lg:top-[76px]">
            <div className="border-2 border-[#0a0a0a] bg-white">
              <div className="border-b-2 border-[#0a0a0a] bg-[#0a0a0a] px-4 py-3">
                <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#ffb900]">
                  Filtros Queimando Panela
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

            <div className="mt-4 border-2 border-[#ffb900] bg-[#ffb900] p-4">
              <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
                Dica Queimando Panela
              </p>
              <p className="mt-2 font-sans text-sm leading-5 text-[#0a0a0a]">
                Use o chip amarelo para filtrar. Quadrado, preto e amarelo — sem
                arredondado.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

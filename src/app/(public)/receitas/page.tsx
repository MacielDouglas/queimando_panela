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
    'Receitas afetivas, autorais e conferidas por IA — leitura leve, foto grande e filtros que respeitam sua escolha.',
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
    <main>
      {/* Hero editorial — mesmo padrão de Home: eyebrow + title + copy + stats */}
      <section
        className="qp-reveal border-b bg-white"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="editorial-container py-12 lg:py-16">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.78rem] font-bold uppercase"
                style={{
                  borderColor: 'var(--line)',
                  background: 'white',
                  color: 'var(--forest)',
                  letterSpacing: '0.08em',
                }}
              >
                <span
                  className="grid size-6 place-items-center rounded-full text-[0.7rem] font-extrabold"
                  style={{
                    background: 'var(--accent-e)',
                    color: 'var(--forest)',
                  }}
                  aria-hidden="true"
                >
                  QP
                </span>
                Queimando Panela
              </span>
              <span
                className="hidden h-6 w-px sm:block"
                style={{ background: 'var(--line)' }}
                aria-hidden="true"
              />
              <span
                className="hidden text-xs font-medium sm:inline"
                style={{ color: 'var(--ink-muted)', letterSpacing: '0.04em' }}
              >
                {total} {total === 1 ? 'receita' : 'receitas'} • curadoria lenta
              </span>
            </div>

            {session?.user && (
              <Link
                href="/receitas/new"
                className="button-queimando-panela button-primary-queimando-panela"
              >
                Publicar receita
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>

          <p className="eyebrow-queimando-panela mt-8">Receitas com história</p>
          <h1 className="section-title-queimando-panela max-w-[20ch] text-balance">
            Receitas para{' '}
            <em className="not-italic" style={{ color: 'var(--forest-hover)' }}>
              aquecer
            </em>{' '}
            a cozinha.
          </h1>
          <p className="section-copy">
            Leitura leve, foto grande e filtros que respeitam sua escolha.
            Escolha categoria, dificuldade ou ingrediente — a página responde
            com calma.
          </p>
        </div>
      </section>

      {/* Busca — faixa muted com mesmo ritmo da Home */}
      <section
        className="qp-reveal border-y"
        style={{ borderColor: 'var(--line)', background: 'var(--muted)' }}
      >
        <div className="editorial-container py-6">
          <div className="flex items-center gap-4">
            <span
              className="hidden shrink-0 items-center gap-2 bg-white px-3 py-1.5 text-[0.78rem] font-bold uppercase sm:inline-flex"
              style={{
                color: 'var(--forest)',
                letterSpacing: '0.08em',
                border: '1px solid var(--line)',
                borderRadius: '999px',
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: 'var(--accent-e)' }}
                aria-hidden
              />
              Busca
            </span>
            <div className="flex-1">
              <RecipeSearch defaultQuery={query} />
            </div>
            <Link
              href="/receitas"
              className="hidden min-h-11 shrink-0 items-center justify-center px-5 text-[0.78rem] font-bold uppercase sm:inline-flex"
              style={{
                color: 'var(--forest)',
                letterSpacing: '0.08em',
                border: '1px solid var(--line)',
                background: 'white',
                borderRadius: '999px',
              }}
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
              <section
                className="qp-reveal overflow-hidden bg-white"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)',
                  boxShadow: '0 10px 30px rgba(24, 58, 55, 0.06)',
                }}
              >
                <RecipeHeroFeatured recipe={latest} />
              </section>
            )}

            {!isFiltered &&
              categoryRows.map((row) => (
                <div key={row.type} className="qp-reveal">
                  <RecipeCategoryRow type={row.type} recipes={row.recipes} />
                </div>
              ))}

            {!isFiltered &&
              utensilRows.map((row) => (
                <div key={row.utensilName} className="qp-reveal">
                  <RecipeUtensilRow
                    utensilName={row.utensilName}
                    recipes={row.recipes}
                  />
                </div>
              ))}

            <div className="qp-reveal">
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
          </div>

          <aside className="space-y-4 lg:sticky lg:top-[96px]">
            <div
              className="qp-reveal overflow-hidden bg-white"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
              }}
            >
              <div
                className="bg-white px-5 py-4"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-1 w-8"
                    style={{ background: 'var(--accent-e)' }}
                    aria-hidden
                  />
                  <p
                    className="text-[0.78rem] font-bold uppercase"
                    style={{ color: 'var(--forest)', letterSpacing: '0.08em' }}
                  >
                    Filtros
                  </p>
                </div>
                <p
                  className="mt-2 text-xs leading-5"
                  style={{ color: 'var(--ink-muted)' }}
                >
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

            <div
              className="qp-reveal p-5"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
                background: 'var(--muted)',
              }}
            >
              <p
                className="text-[0.78rem] font-bold uppercase"
                style={{ color: 'var(--forest)', letterSpacing: '0.08em' }}
              >
                Dica
              </p>
              <p
                className="mt-2 text-sm leading-6"
                style={{ color: 'var(--ink-muted)', textWrap: 'pretty' }}
              >
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

import type { Metadata } from 'next';
import Link from 'next/link';

// Listagem usa ISR curto: sem filtro é compartilhável no CDN,
// com filtro é marcada noindex para não gerar crawl infinito.
export const revalidate = 300;

import { getAllRecipes } from '@/features/recipes/actions/get-all-recipes';
import { getRecipeCategoryCounts } from '@/features/recipes/actions/get-recipe-category-counts';
import { getRecipeFilterOptions } from '@/features/recipes/actions/get-recipe-filter-options';
import { PublishRecipeButton } from '@/features/recipes/components/recipe-list/PublishRecipeButton';
import { RecipeFilters } from '@/features/recipes/components/recipe-list/RecipeFilters';
import { RecipeGrid } from '@/features/recipes/components/recipe-list/RecipeGrid';
import { RecipeHeroFeatured } from '@/features/recipes/components/recipe-list/RecipeHeroFeatured';
import { RecipeSearch } from '@/features/recipes/components/recipe-list/RecipeSearch';
import { normalizeString } from '@/features/recipes/lib/recipe-params';
import type { RecipeDifficultyValue } from '@/features/recipes/types/recipe.types';

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

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const hasFilter = Boolean(
    params.q ??
      params.categoria ??
      params.tipo ??
      params.dificuldade ??
      params.utensilio ??
      params.ingrediente ??
      (params.page && params.page !== '1'),
  );

  if (hasFilter) {
    return {
      title: 'Receitas — Queimando Panela',
      description:
        'Receitas afetivas, autorais e conferidas por IA — leitura leve, foto grande e filtros que respeitam sua escolha.',
      robots: { index: false, follow: true },
    };
  }

  return {
    title: 'Receitas — Queimando Panela',
    description:
      'Receitas afetivas, autorais e conferidas por IA — leitura leve, foto grande e filtros que respeitam sua escolha.',
  };
}

function getSingle(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

const MAX_FILTER_VALUE_LENGTH = 40;
const MAX_MULTI_VALUES = 5;

function getMany(value: SearchValue) {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .map((item) => item.trim().slice(0, MAX_FILTER_VALUE_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_MULTI_VALUES);
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
  const params = await searchParams;

  const query = normalizeString(params.q)?.slice(0, 60);
  const category = normalizeString(getSingle(params.categoria))?.slice(
    0,
    MAX_FILTER_VALUE_LENGTH,
  );
  const types = getMany(params.tipo);
  const difficulty = parseDifficulty(params.dificuldade);
  const utensils = getMany(params.utensilio);
  const ingredients = getMany(params.ingrediente);
  const rawPage = normalizeString(params.page);
  const parsedPage = Number(rawPage ?? '1');
  const currentPage = Math.min(
    Math.max(Number.isFinite(parsedPage) ? Math.floor(parsedPage) : 1, 1),
    20,
  );
  // 12 cards: metade do payload no 4G fraco; paginação compensa.
  const take = 12;
  const skip = (currentPage - 1) * take;

  const isFiltered = !!(
    query ||
    category ||
    difficulty ||
    types.length > 0 ||
    utensils.length > 0 ||
    ingredients.length > 0
  );

  // Sem filtro: grade (2 queries) + contadores (1) + filtros (cache 24h).
  // Com filtro: só grade + filtros. Hero deriva de recipes[0] — sem query extra.
  // Sessão NÃO é lida aqui (headers() quebraria o ISR): o CTA de publicar
  // é uma ilha client (PublishRecipeButton).
  const [allRecipesResult, categoryCounts, filterOptions] = await Promise.all([
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
    isFiltered ? Promise.resolve([]) : getRecipeCategoryCounts(8),
    getRecipeFilterOptions(),
  ]);

  const { recipes, total } = allRecipesResult;
  const totalPages = Math.max(Math.ceil(total / take), 1);
  const heroRecipe = !isFiltered ? (recipes[0] ?? null) : null;

  const filtersCard = (
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
  );

  return (
    <main>
      {/* Hero editorial — pattern igual à Home: fundo transparente para revelar pattern.jpg */}
      <section
        className="qp-reveal border-b bg-transparent"
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
                  color: 'var(--cocoa)',
                  letterSpacing: '0.08em',
                }}
              >
                <span
                  className="grid size-6 place-items-center rounded-full text-[0.7rem] font-extrabold"
                  style={{
                    background: 'var(--food-accent)',
                    color: 'var(--cocoa)',
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

            <PublishRecipeButton />
          </div>

          <p className="eyebrow-queimando-panela mt-8">Receitas com história</p>
          <h1 className="section-title-queimando-panela max-w-[20ch] text-balance">
            Receitas para{' '}
            <em className="not-italic" style={{ color: 'var(--cocoa-hover)' }}>
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

      {/* Busca — faixa transparente para revelar pattern.jpg igual à Home */}
      <section
        className="qp-reveal border-y bg-transparent"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="editorial-container py-6">
          <div className="flex items-center gap-4">
            <span
              className="hidden shrink-0 items-center gap-2 bg-white px-3 py-1.5 text-[0.78rem] font-bold uppercase sm:inline-flex"
              style={{
                color: 'var(--cocoa)',
                letterSpacing: '0.08em',
                border: '1px solid var(--line)',
                borderRadius: '999px',
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: 'var(--food-accent)' }}
                aria-hidden
              />
              Busca
            </span>
            <div className="flex-1">
              <RecipeSearch defaultQuery={query} />
            </div>
            <Link
              href="/receitas"
              prefetch={false}
              className="hidden min-h-11 shrink-0 items-center justify-center px-5 text-[0.78rem] font-bold uppercase sm:inline-flex"
              style={{
                color: 'var(--cocoa)',
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
            {heroRecipe && (
              <section
                className="qp-reveal overflow-hidden bg-white"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)',
                  boxShadow: '0 10px 30px rgba(27, 41, 32, 0.06)',
                }}
              >
                <RecipeHeroFeatured recipe={heroRecipe} />
              </section>
            )}

            {!isFiltered && categoryCounts.length > 0 && (
              <nav
                className="qp-reveal flex flex-wrap items-center gap-2"
                aria-label="Explorar por categoria"
              >
                {categoryCounts.map((item) => (
                  <Link
                    key={item.name}
                    href={`/receitas?categoria=${encodeURIComponent(item.name)}`}
                    prefetch={false}
                    className="rounded-full bg-white px-3.5 py-2 text-[0.78rem] font-bold uppercase transition-colors"
                    style={{
                      border: '1px solid var(--line)',
                      color: 'var(--cocoa)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.name} · {item.count}
                  </Link>
                ))}
              </nav>
            )}

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
            {/* Mobile: filtros colapsados (details nativo, sem JS) para
                economizar scroll + dados. Desktop: sempre visível. */}
            <details className="qp-reveal overflow-hidden bg-white lg:hidden">
              <summary
                className="flex cursor-pointer list-none items-center justify-between bg-white px-5 py-4"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-1 w-8"
                    style={{ background: 'var(--food-accent)' }}
                    aria-hidden
                  />
                  <span
                    className="text-[0.78rem] font-bold uppercase"
                    style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
                  >
                    Filtros
                  </span>
                </span>
                <span
                  className="text-[0.78rem] font-bold uppercase"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  Abrir
                </span>
              </summary>
              <div className="p-4">{filtersCard}</div>
            </details>

            <div
              className="qp-reveal hidden overflow-hidden bg-white lg:block"
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
                    style={{ background: 'var(--food-accent)' }}
                    aria-hidden
                  />
                  <p
                    className="text-[0.78rem] font-bold uppercase"
                    style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
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
              <div className="p-4">{filtersCard}</div>
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
                style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
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

import Link from 'next/link';

import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import type { RecipeDifficultyValue } from '@/features/recipes/types/recipe.types';
import { RecipeCard } from './RecipeCard';

type Props = {
  recipes: RecipeCardData[];
  total: number;
  currentPage: number;
  totalPages: number;
  q?: string;
  categoria?: string;
  tipo?: string[];
  dificuldade?: RecipeDifficultyValue;
  utensilio?: string[];
  ingrediente?: string[];
};

function buildPageHref({
  page,
  q,
  categoria,
  tipo = [],
  dificuldade,
  utensilio = [],
  ingrediente = [],
}: {
  page: number;
  q?: string;
  categoria?: string;
  tipo?: string[];
  dificuldade?: RecipeDifficultyValue;
  utensilio?: string[];
  ingrediente?: string[];
}) {
  const params = new URLSearchParams();

  if (q) params.set('q', q);
  if (categoria) params.set('categoria', categoria);
  if (dificuldade) params.set('dificuldade', dificuldade);

  tipo.forEach((item) => params.append('tipo', item));
  utensilio.forEach((item) => params.append('utensilio', item));
  ingrediente.forEach((item) => params.append('ingrediente', item));

  if (page > 1) params.set('page', String(page));

  const query = params.toString();
  return query ? `/receitas?${query}` : '/receitas';
}

function PaginationLink({
  label,
  page,
  disabled,
  q,
  categoria,
  tipo,
  dificuldade,
  utensilio,
  ingrediente,
}: {
  label: string;
  page: number;
  disabled: boolean;
  q?: string;
  categoria?: string;
  tipo?: string[];
  dificuldade?: RecipeDifficultyValue;
  utensilio?: string[];
  ingrediente?: string[];
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-400">
        {label}
      </span>
    );
  }

  const href = buildPageHref({
    page,
    q,
    categoria,
    tipo,
    dificuldade,
    utensilio,
    ingrediente,
  });

  return (
    <Link
      href={href}
      className="border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-700 hover:border-amber-500 hover:text-amber-700"
    >
      {label}
    </Link>
  );
}

export function RecipeGrid({
  recipes,
  total,
  currentPage,
  totalPages,
  q,
  categoria,
  tipo,
  dificuldade,
  utensilio,
  ingrediente,
}: Props) {
  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase">
            Receitas da comunidade
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">
            {q ? `Resultados para "${q}"` : 'Todas as receitas'}
          </h2>
        </div>

        <p className="text-xs text-neutral-500">
          {total === 0
            ? 'Nenhuma receita'
            : total === 1
              ? '1 receita'
              : `${total} receitas`}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="border border-dashed border-neutral-300 bg-white px-4 py-12 text-center">
          <p className="mb-1 text-sm font-medium text-neutral-700">
            Nenhuma receita encontrada.
          </p>
          <p className="text-xs text-neutral-500">
            Tente outro termo ou remova algum filtro.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-3"
              aria-label="Paginação"
            >
              <PaginationLink
                label="← Anterior"
                page={currentPage - 1}
                disabled={currentPage <= 1}
                q={q}
                categoria={categoria}
                tipo={tipo}
                dificuldade={dificuldade}
                utensilio={utensilio}
                ingrediente={ingrediente}
              />

              <span className="text-xs text-neutral-600">
                {currentPage} / {totalPages}
              </span>

              <PaginationLink
                label="Próxima →"
                page={currentPage + 1}
                disabled={currentPage >= totalPages}
                q={q}
                categoria={categoria}
                tipo={tipo}
                dificuldade={dificuldade}
                utensilio={utensilio}
                ingrediente={ingrediente}
              />
            </nav>
          )}
        </>
      )}
    </section>
  );
}

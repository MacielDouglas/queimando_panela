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
  tipo.forEach((item) => {
    params.append('tipo', item);
  });
  utensilio.forEach((item) => {
    params.append('utensilio', item);
  });
  ingrediente.forEach((item) => {
    params.append('ingrediente', item);
  });
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
      <span className="rounded-full border border-[#e5e5e5] bg-[#f5f5f5] px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
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
      className="rounded-full border border-[#0a0a0a] bg-white px-4 py-2 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900]"
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
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5e5] pb-6">
        <div className="max-w-[60ch]">
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-[#ffb900]" aria-hidden />
            <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-[#6b6b6b]">
              Queimando Panela
            </p>
          </div>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase leading-none tracking-[-0.015em] text-[#0a0a0a] sm:text-2xl text-wrap-balance">
            {q ? `Resultados para "${q}"` : 'Todas as receitas'}
          </h2>
        </div>
        <p className="shrink-0 rounded-full border border-[#e5e5e5] bg-white px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-[0.12em] text-[#0a0a0a]">
          {total === 0
            ? 'Nenhuma'
            : total === 1
              ? '1 receita'
              : `${total} receitas`}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="mt-6 rounded-[12px] border border-[#e5e5e5] bg-[#f5f5f5] px-6 py-12 text-center">
          <p className="mx-auto grid size-10 place-items-center rounded-full bg-white font-display text-xs font-extrabold text-[#0a0a0a] ring-1 ring-[#e5e5e5]">
            Ø
          </p>
          <p className="mt-3 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
            Nenhuma receita encontrada
          </p>
          <p className="mx-auto mt-2 max-w-[42ch] font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
            Tente outro termo ou remova algum filtro — a busca é por título,
            resumo e história.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-center gap-3"
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
              <span className="rounded-full bg-[#0a0a0a] px-3.5 py-2 font-display text-xs font-extrabold tracking-wide text-white">
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

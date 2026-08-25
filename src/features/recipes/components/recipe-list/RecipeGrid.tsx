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
      <span className="border-2 border-[#e5e5e5] bg-[#f5f5f5] px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
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
      className="border-2 border-[#0a0a0a] bg-white px-4 py-2 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
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
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-[#0a0a0a] pb-3">
        <div>
          <p className="inline-block bg-[#ffb900] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
            Panelinha Estapar
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase leading-none tracking-[-0.01em] text-[#0a0a0a] sm:text-2xl">
            {q ? `Resultados para "${q}"` : 'Todas as receitas'}
          </h2>
        </div>
        <p className="border-2 border-[#0a0a0a] bg-white px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.12em] text-[#0a0a0a]">
          {total === 0
            ? 'Nenhuma'
            : total === 1
              ? '1 receita'
              : `${total} receitas`}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="mt-6 border-2 border-dashed border-[#e5e5e5] bg-white px-6 py-12 text-center">
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
            Nenhuma receita encontrada
          </p>
          <p className="mt-2 font-sans text-sm text-[#6b6b6b]">
            Tente outro termo ou remova algum filtro.
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
              <span className="border-2 border-[#0a0a0a] bg-[#0a0a0a] px-3 py-2 font-display text-xs font-extrabold text-white">
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

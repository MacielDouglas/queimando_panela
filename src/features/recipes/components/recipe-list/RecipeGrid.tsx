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
      <span
        className="rounded-full px-4 py-2 text-[0.78rem] font-bold uppercase"
        style={{
          border: '1px solid var(--line)',
          background: 'var(--muted)',
          color: 'var(--ink-muted)',
          letterSpacing: '0.08em',
        }}
      >
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
      className="rounded-full bg-white px-4 py-2 text-[0.78rem] font-bold uppercase transition-colors hover:text-white"
      style={{
        border: '1px solid var(--cocoa)',
        color: 'var(--cocoa)',
        letterSpacing: '0.08em',
      }}
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
      <div
        className="flex flex-wrap items-end justify-between gap-4 pb-6"
        style={{ borderBottom: '1px solid var(--line)' }}
      >
        <div className="max-w-[60ch]">
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
              Queimando Panela
            </p>
          </div>
          <h2
            className="mt-2 font-display text-xl font-extrabold leading-none tracking-[-0.015em] text-balance sm:text-2xl"
            style={{ color: 'var(--cocoa)' }}
          >
            {q ? `Resultados para "${q}"` : 'Todas as receitas'}
          </h2>
        </div>
        <p
          className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-[0.78rem] font-bold uppercase"
          style={{
            border: '1px solid var(--line)',
            color: 'var(--cocoa)',
            letterSpacing: '0.08em',
          }}
        >
          {total === 0
            ? 'Nenhuma'
            : total === 1
              ? '1 receita'
              : `${total} receitas`}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div
          className="mt-6 px-6 py-12 text-center"
          style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--line)',
            background: 'var(--muted)',
          }}
        >
          <p
            className="mx-auto grid size-10 place-items-center rounded-full bg-white text-xs font-extrabold"
            style={{ color: 'var(--cocoa)', border: '1px solid var(--line)' }}
          >
            Ø
          </p>
          <p
            className="mt-3 text-sm font-extrabold uppercase"
            style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
          >
            Nenhuma receita encontrada
          </p>
          <p
            className="mx-auto mt-2 max-w-[42ch] text-sm leading-6"
            style={{ color: 'var(--ink-muted)', textWrap: 'pretty' }}
          >
            Tente outro termo ou remova algum filtro — a busca é por título,
            resumo e história.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <span
                className="rounded-full px-3.5 py-2 text-[0.78rem] font-extrabold tracking-wide text-white"
                style={{ background: 'var(--cocoa)' }}
              >
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

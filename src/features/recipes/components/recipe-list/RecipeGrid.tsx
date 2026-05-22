import { RecipeCard } from './RecipeCard';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

type Props = {
  recipes: RecipeCardData[];
  total: number;
  currentPage: number;
  totalPages: number;
  q?: string;
  tipo?: string;
  dificuldade?: string;
  utensilio?: string;
};

export function RecipeGrid({
  recipes,
  total,
  currentPage,
  totalPages,
  q,
  tipo,
  dificuldade,
  utensilio,
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
                tipo={tipo}
                dificuldade={dificuldade}
                utensilio={utensilio}
              />
              <span className="text-xs text-neutral-600">
                {currentPage} / {totalPages}
              </span>
              <PaginationLink
                label="Próxima →"
                page={currentPage + 1}
                disabled={currentPage >= totalPages}
                q={q}
                tipo={tipo}
                dificuldade={dificuldade}
                utensilio={utensilio}
              />
            </nav>
          )}
        </>
      )}
    </section>
  );
}

function PaginationLink({
  label,
  page,
  disabled,
  q,
  tipo,
  dificuldade,
  utensilio,
}: {
  label: string;
  page: number;
  disabled: boolean;
  q?: string;
  tipo?: string;
  dificuldade?: string;
  utensilio?: string;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-400">
        {label}
      </span>
    );
  }

  const search = new URLSearchParams();
  if (page > 1) search.set('page', String(page));
  if (q) search.set('q', q);
  if (tipo) search.set('tipo', tipo);
  if (dificuldade) search.set('dificuldade', dificuldade);
  if (utensilio) search.set('utensilio', utensilio);

  const href = `/receitas?${search.toString()}`;

  return (
    <a
      href={href}
      className="border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-700 hover:border-amber-500 hover:text-amber-700"
    >
      {label}
    </a>
  );
}

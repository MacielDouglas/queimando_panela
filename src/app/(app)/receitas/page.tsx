import { getAllRecipes } from '@/features/recipes/actions/get-all-recipes';
import type { RecipeDifficulty } from '../../../../generated/prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { getRecipeTypes } from '@/features/recipes/actions/get-recipe-types';

type SearchParams = Promise<{ page?: string; type?: string; difficulty?: string }>;

export const metadata = {
  title: 'Receitas',
  description: 'Todas as receitas do Queimando Panela',
};

export default async function ReceitasPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const type = params.type as string | undefined;
  const difficulty = params.difficulty as RecipeDifficulty | undefined;

  const [{ recipes, total, totalPages }, recipeTypes] = await Promise.all([
    getAllRecipes({ page, type, difficulty }),
    getRecipeTypes(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="mb-10 border-b border-stone-200 pb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-600">
          Queimando Panela
        </p>
        <h1 className="text-4xl font-bold text-stone-900 md:text-5xl">Receitas</h1>
        <p className="mt-2 text-stone-500">
          {total} {total === 1 ? 'receita' : 'receitas'} para você explorar
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <FilterChip href="/receitas" active={!type && !difficulty} label="Todas" />

        {recipeTypes.length > 0 && <div className="h-4 w-px bg-stone-200" />}

        {recipeTypes.map((t) => (
          <FilterChip
            key={t}
            href={`/receitas?type=${encodeURIComponent(t)}${difficulty ? `&difficulty=${difficulty}` : ''}`}
            active={type === t}
            label={t}
          />
        ))}

        <div className="h-4 w-px bg-stone-200" />

        <FilterChip
          href={`/receitas?difficulty=EASY${type ? `&type=${encodeURIComponent(type)}` : ''}`}
          active={difficulty === 'EASY'}
          label="Fácil"
        />
        <FilterChip
          href={`/receitas?difficulty=MEDIUM${type ? `&type=${encodeURIComponent(type)}` : ''}`}
          active={difficulty === 'MEDIUM'}
          label="Média"
        />
        <FilterChip
          href={`/receitas?difficulty=HARD${type ? `&type=${encodeURIComponent(type)}` : ''}`}
          active={difficulty === 'HARD'}
          label="Difícil"
        />

        <Link
          href="/receitas/nova"
          className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 transition hover:bg-amber-400"
        >
          + Nova receita
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <span className="text-5xl">🍳</span>
          <h2 className="mt-4 text-xl font-semibold text-stone-900">Nenhuma receita ainda</h2>
          <p className="mt-2 text-sm text-stone-400">
            Tente outros filtros ou adicione a primeira.
          </p>
          <Link
            href="/receitas/nova"
            className="mt-6 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400"
          >
            Criar receita
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {recipes.map((recipe, i) => {
            const cover = recipe.images[0];
            const isFeature = i === 0;
            const totalTime = (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);
            const typeEmoji = { SWEET: '🍰', SAVORY: '🥩', DRINK: '🥤', OTHER: '🍴' }[recipe.type];

            return (
              <Link
                key={recipe.id}
                href={`/receitas/${recipe.slug}`}
                className={`group relative overflow-hidden rounded-2xl bg-stone-100 ${
                  isFeature ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <div className={`overflow-hidden ${isFeature ? 'h-80 md:h-96' : 'h-40 md:h-52'}`}>
                  {cover ? (
                    <Image
                      src={cover.url}
                      alt={cover.alt}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading={isFeature ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-amber-50 to-stone-200 text-4xl">
                      {typeEmoji}
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-stone-900/70 via-stone-900/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
                    {typeEmoji}{' '}
                    {recipe.type === 'SWEET'
                      ? 'Doce'
                      : recipe.type === 'SAVORY'
                        ? 'Salgada'
                        : recipe.type === 'DRINK'
                          ? 'Bebida'
                          : 'Outro'}
                  </p>

                  <h2
                    className={`font-bold leading-snug text-white ${
                      isFeature ? 'text-xl md:text-2xl' : 'text-sm'
                    }`}
                  >
                    {recipe.title}
                  </h2>

                  {isFeature && recipe.summary && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-white/70">{recipe.summary}</p>
                  )}

                  <div className="mt-2 flex items-center gap-3 text-xs text-white/60">
                    {totalTime > 0 && <span>⏱ {totalTime} min</span>}
                    {recipe.servings && <span>🍽 {recipe.servings} porções</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={`/receitas?page=${page - 1}${type ? `&type=${type}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}`}
              className="rounded-full border border-stone-300 px-5 py-2 text-sm text-stone-700 hover:bg-stone-50"
            >
              ← Anterior
            </Link>
          )}

          <span className="text-sm text-stone-400">
            Página {page} de {totalPages}
          </span>

          {page < totalPages && (
            <Link
              href={`/receitas?page=${page + 1}${type ? `&type=${type}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}`}
              className="rounded-full border border-stone-300 px-5 py-2 text-sm text-stone-700 hover:bg-stone-50"
            >
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
        active ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
      }`}
    >
      {label}
    </Link>
  );
}

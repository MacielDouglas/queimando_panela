import Image from 'next/image';
import Link from 'next/link';
import type { RecipeDetail } from '../actions/get-recipe';

type Props = {
  recipe: Pick<RecipeDetail, 'slug' | 'title' | 'type' | 'difficulty' | 'summary' | 'images'>;
};

const difficultyLabel = { EASY: 'Fácil', MEDIUM: 'Média', HARD: 'Difícil' };

export function RecipeHero({ recipe }: Props) {
  const cover = recipe.images.find((i) => i.isCover) ?? recipe.images[0];

  return (
    <header>
      {/* Imagem de capa */}
      <div className="relative h-72 w-full overflow-hidden bg-stone-200 md:h-120">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            className="object-cover"
            loading="eager"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-amber-50 to-stone-100 text-7xl">
            🍽️
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-stone-900/60 to-transparent" />
        <div className="absolute left-4 top-4 md:left-10">
          <Link
            href="/receitas"
            className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
          >
            ← Receitas
          </Link>
        </div>
      </div>

      {/* Título e badges */}
      <div className="mx-auto max-w-5xl px-4 pt-8 md:px-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 uppercase tracking-wide">
            {recipe.type}
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 uppercase tracking-wide">
            {difficultyLabel[recipe.difficulty]}
          </span>
          <Link
            href={`/receitas/${recipe.slug}/editar`}
            className="ml-auto rounded-md border border-stone-300 px-4 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
          >
            Editar
          </Link>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-stone-900 md:text-4xl">
          {recipe.title}
        </h1>
        {recipe.summary && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-500">
            {recipe.summary}
          </p>
        )}
      </div>
    </header>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { Clock3, Flame, ArrowRight } from 'lucide-react';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

const difficultyLabel: Record<'EASY' | 'MEDIUM' | 'HARD', string> = {
  EASY: 'Fácil',
  MEDIUM: 'Médio',
  HARD: 'Difícil',
};

type Props = {
  recipe: RecipeCardData;
};

export function RecipeHeroFeatured({ recipe }: Props) {
  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0) || null;

  return (
    <div className="grid gap-0 border border-neutral-200 bg-white sm:grid-cols-[1.4fr_1fr] lg:grid-cols-[1.6fr_1fr]">
      <div className="relative min-h-70 sm:min-h-105">
        {recipe.coverUrl ? (
          <Image
            src={recipe.coverUrl}
            alt={recipe.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 60vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-neutral-100">
            <span className="text-sm text-neutral-400">Sem imagem</span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase">
            Última receita
          </p>

          <h2 className="text-2xl leading-tight font-bold tracking-tight text-neutral-950 sm:text-3xl lg:text-4xl">
            {recipe.title}
          </h2>

          {recipe.summary && (
            <p className="text-sm leading-relaxed text-neutral-700">
              {recipe.summary}
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-neutral-600">
            {recipe.type && (
              <span className="border border-amber-200 bg-amber-50 px-3 py-1 font-semibold tracking-[0.14em] text-amber-800 uppercase">
                {recipe.type}
              </span>
            )}

            {totalTime && (
              <span className="flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {totalTime} min
              </span>
            )}

            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              {difficultyLabel[recipe.difficulty]}
            </span>
          </div>

          {recipe.authorName && (
            <p className="text-xs text-neutral-500">
              por{' '}
              <span className="font-semibold text-neutral-800">
                {recipe.authorName}
              </span>
            </p>
          )}
        </div>

        <Link
          href={`/receitas/${recipe.slug}`}
          className="inline-flex w-full items-center justify-center gap-2 border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-amber-500 hover:bg-amber-500 hover:text-neutral-950"
        >
          Ver receita completa
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

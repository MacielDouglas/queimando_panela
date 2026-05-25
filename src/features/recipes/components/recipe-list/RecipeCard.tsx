import Link from 'next/link';
import Image from 'next/image';
import { Clock3, Flame } from 'lucide-react';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

const difficultyLabel: Record<'EASY' | 'MEDIUM' | 'HARD', string> = {
  EASY: 'Fácil',
  MEDIUM: 'Médio',
  HARD: 'Difícil',
};

type Props = {
  recipe: RecipeCardData;
  aspectRatio?: '4/5' | '3/4' | '16/9';
};

export function RecipeCard({ recipe, aspectRatio = '16/9' }: Props) {
  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0) || null;

  const aspectClass =
    aspectRatio === '4/5'
      ? 'aspect-[4/5]'
      : aspectRatio === '3/4'
        ? 'aspect-[3/4]'
        : 'aspect-video';

  return (
    <article className="group flex h-full flex-col border border-neutral-200 bg-white">
      <div
        className={`relative w-full overflow-hidden bg-neutral-100 ${aspectClass}`}
      >
        {recipe.coverUrl ? (
          <Image
            src={recipe.coverUrl}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-neutral-400">Sem imagem</span>
          </div>
        )}

        {recipe.types[0] && (
          <span className="absolute top-3 left-3 border border-amber-300 bg-amber-50/90 px-2 py-1 text-xs font-semibold tracking-[0.16em] text-amber-800 uppercase backdrop-blur-sm">
            {recipe.types[0]}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="space-y-2">
          <h3 className="text-base leading-snug font-semibold tracking-tight text-neutral-950 group-hover:text-amber-700">
            {recipe.title}
          </h3>

          {recipe.summary && (
            <p className="line-clamp-2 text-xs leading-relaxed text-neutral-600">
              {recipe.summary}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-neutral-500">
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

          <Link
            href={`/receitas/${recipe.slug}`}
            className="text-xs font-semibold text-amber-700 hover:text-amber-500"
          >
            Ver →
          </Link>
        </div>
      </div>
    </article>
  );
}

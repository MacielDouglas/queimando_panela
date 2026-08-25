import { Clock3, Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import { difficultyLabel } from '../../types/recipe.types';

type Props = {
  recipe: RecipeCardData;
  aspectRatio?: '4/5' | '3/4' | '16/9';
};

export function RecipeCard({ recipe }: Props) {
  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0) || null;

  return (
    <article className="flex h-full flex-col border-2 border-[#0a0a0a] bg-white hover:border-[#ffb900] hover:bg-[#fffef5]">
      <Link
        href={`/receitas/${recipe.slug}`}
        aria-label={`Ver receita: ${recipe.title}`}
        className="group relative flex h-full w-full flex-col bg-white"
        tabIndex={-1}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f5f5f5] border-b-2 border-[#0a0a0a]">
          {recipe.coverUrl ? (
            <Image
              src={recipe.coverUrl}
              alt={recipe.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#f5f5f5]">
              <span className="border-2 border-[#0a0a0a] bg-white px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
                Sem foto
              </span>
            </div>
          )}
          <span
            className="absolute top-0 left-0 h-1 w-full bg-[#ffb900]"
            aria-hidden="true"
          />
          {recipe.types[0] && (
            <span className="absolute left-2 top-3 border-2 border-[#0a0a0a] bg-[#ffb900] px-2 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
              {recipe.types[0]}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="line-clamp-2 font-display text-sm font-extrabold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a]">
            {recipe.title}
          </h3>
          {recipe.summary && (
            <p className="line-clamp-2 font-sans text-xs leading-5 text-[#6b6b6b]">
              {recipe.summary}
            </p>
          )}
          <div className="mt-auto flex items-center gap-3 border-t-2 border-[#0a0a0a] pt-2 font-sans text-xs text-[#6b6b6b]">
            {totalTime && (
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3.5 text-[#0a0a0a]" />
                {totalTime} min
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Flame className="size-3.5 text-[#ffb900]" />
              {difficultyLabel[recipe.difficulty]}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

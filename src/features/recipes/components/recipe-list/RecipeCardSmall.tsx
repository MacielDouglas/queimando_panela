import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import { Clock3, Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { difficultyLabel } from '../../types/recipe.types';

type Props = {
  recipe: RecipeCardData;
  priority?: boolean;
};

export function RecipeCardSmall({ recipe, priority = false }: Props) {
  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0) || null;

  return (
    <article className="group">
      {/* Imagem quadrada clicável */}
      <Link
        href={`/receitas/${recipe.slug}`}
        aria-label={`Ver receita: ${recipe.title}`}
        className="relative block aspect-square w-full overflow-hidden bg-neutral-100"
        tabIndex={-1}
      >
        {recipe.coverUrl ? (
          <Image
            src={recipe.coverUrl}
            alt={recipe.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-neutral-100"
            aria-hidden="true"
          >
            <span className="text-xs text-neutral-400">Sem imagem</span>
          </div>
        )}
      </Link>

      {/* Texto abaixo da imagem */}
      <div className="flex flex-col gap-1 pt-2.5">
        <Link
          href={`/receitas/${recipe.slug}`}
          className="focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <h4 className="line-clamp-2 text-sm leading-snug font-semibold tracking-tight text-neutral-950 transition-colors group-hover:text-amber-700">
            {recipe.title}
          </h4>
        </Link>

        <div
          className="flex items-center gap-3 text-neutral-500"
          aria-label="Informações da receita"
        >
          {totalTime && (
            <span className="flex items-center gap-1 text-xs">
              <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{totalTime} min</span>
            </span>
          )}
          <span className="flex items-center gap-1 text-xs">
            <Flame
              className="h-3.5 w-3.5 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            <span>{difficultyLabel[recipe.difficulty]}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

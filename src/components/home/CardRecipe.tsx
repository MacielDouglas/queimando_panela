import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import { difficultyLabel } from '@/features/recipes/types/recipe.types';
import { Clock3, Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface RecipeCardProps {
  recipe: RecipeCardData;
  priority?: boolean;
}

export default function CardRecipe({
  recipe,
  priority = false,
}: RecipeCardProps) {
  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0) || null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden bg-white">
      {/* Imagem quadrada */}
      <Link
        href={`/receitas/${recipe.slug}`}
        aria-label={`Ver receita: ${recipe.title}`}
        className="relative block aspect-video w-full overflow-hidden bg-neutral-100"
        tabIndex={-1}
      >
        {recipe.coverUrl ? (
          <Image
            src={recipe.coverUrl}
            alt={recipe.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-neutral-100"
            aria-hidden="true"
          >
            <span className="text-xs text-neutral-400">Sem imagem</span>
          </div>
        )}

        {/* Badge de tipo */}
        {recipe.types[0] && (
          <span
            className="absolute top-2 left-2 border border-amber-300 bg-amber-50/90 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-amber-800 uppercase backdrop-blur-sm"
            aria-hidden="true"
          >
            {recipe.types[0]}
          </span>
        )}
      </Link>

      {/* Metadados abaixo da imagem */}
      <div className="flex flex-1 flex-col gap-1.5 pt-3">
        <Link
          href={`/receitas/${recipe.slug}`}
          className="focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold tracking-tight text-neutral-950 transition-colors group-hover:text-amber-700 sm:text-base">
            {recipe.title}
          </h3>
        </Link>

        {/* Tempo + dificuldade */}
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

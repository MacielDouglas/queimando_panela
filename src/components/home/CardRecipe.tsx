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
            className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-50 to-amber-100"
            aria-hidden="true"
          >
            <svg viewBox="0 0 64 64" className="size-8 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1.5" y="1.5" width="61" height="61" rx="4" />
              <path d="M16 25.5C16 19.7 20.5 16 26.6 16C32.7 16 37.2 19.8 37.2 25.5C37.2 31.3 32.7 35.2 26.6 35.2C20.5 35.2 16 31.3 16 25.5ZM21 25.5C21 28.7 23.2 31 26.6 31C30 31 32.2 28.7 32.2 25.5C32.2 22.4 30 20.2 26.6 20.2C23.2 20.2 21 22.4 21 25.5ZM29.8 32.8L37.6 40.8" />
              <path d="M41 16V41M41 16H49.8C55.1 16 58 19.2 58 23.9C58 28.6 55.1 31.8 49.8 31.8H41" />
            </svg>
          </div>
        )}

        {/* Badge de tipo */}
        {recipe.types[0] && (
          <span
            className="absolute top-2 left-2 border border-amber-300 bg-amber-50/90 px-2 py-0.5 text-[11px] font-semibold tracking-[0.14em] text-amber-800 uppercase backdrop-blur-sm"
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
          <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold tracking-tight text-neutral-950 transition-colors group-hover:text-amber-700 sm:text-base">
            {recipe.title}
          </h3>
        </Link>

        {/* Tempo + dificuldade */}
        <div
          className="flex items-center gap-3 text-neutral-500"
          aria-label="Informações da receita"
        >
          {totalTime && (
            <span className="flex items-center gap-1 text-[13px]">
              <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{totalTime} min</span>
            </span>
          )}
          <span className="flex items-center gap-1 text-[13px]">
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

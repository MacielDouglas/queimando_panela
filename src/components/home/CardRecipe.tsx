import { Clock3, Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import { difficultyLabel } from '@/features/recipes/types/recipe.types';

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
    <article className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white transition-[border-color,box-shadow] hover:border-[#0a0a0a] hover:shadow-sm focus-within:border-[#0a0a0a] focus-within:ring-2 focus-within:ring-[#ffb900] focus-within:ring-offset-2">
      {/* Imagem 4:3 blog híbrido 12px */}
      <Link
        href={`/receitas/${recipe.slug}`}
        aria-label={`Ver receita: ${recipe.title}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[#f5f5f5] focus:outline-none"
        tabIndex={-1}
      >
        {recipe.coverUrl ? (
          <Image
            src={recipe.coverUrl}
            alt={recipe.title}
            fill
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5]">
            <span className="rounded-full border border-[#e5e5e5] bg-white px-2.5 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6b6b6b]">
              Sem foto
            </span>
          </div>
        )}

        {recipe.types[0] && (
          <span className="absolute left-2.5 top-2.5 rounded-full border border-[#0a0a0a]/10 bg-[#ffb900] px-2.5 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] shadow-sm">
            {recipe.types[0]}
          </span>
        )}
        {/* Faixa amarela Queimando Panela no card */}
        <span
          className="absolute inset-x-0 top-0 h-1 bg-[#ffb900]"
          aria-hidden="true"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          href={`/receitas/${recipe.slug}`}
          className="rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2"
        >
          <h3 className="line-clamp-2 font-display text-[15px] font-extrabold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a] decoration-[#ffb900] decoration-2 underline-offset-4 group-hover:underline text-wrap-balance">
            {recipe.title}
          </h3>
        </Link>
        {recipe.summary && (
          <p className="line-clamp-2 font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
            {recipe.summary}
          </p>
        )}

        <div
          className="mt-auto flex items-center gap-3 border-t border-[#f2f2f2] pt-3 font-sans text-xs text-[#6b6b6b]"
          aria-hidden="true"
        >
          {totalTime && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3
                className="size-3.5 shrink-0 text-[#0a0a0a]"
                aria-hidden
              />
              {totalTime} min
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Flame className="size-3.5 shrink-0 text-[#ffb900]" aria-hidden />
            {difficultyLabel[recipe.difficulty]}
          </span>
        </div>
      </div>
    </article>
  );
}

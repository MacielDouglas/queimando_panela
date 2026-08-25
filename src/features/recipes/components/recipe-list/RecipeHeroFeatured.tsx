import { ArrowRight, Clock3, Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import { difficultyLabel } from '../../types/recipe.types';

type Props = {
  recipe: RecipeCardData;
};

export function RecipeHeroFeatured({ recipe }: Props) {
  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0) || null;

  return (
    <div className="grid sm:grid-cols-[1.3fr_1fr] border-2 border-[#0a0a0a] bg-white">
      <div className="relative min-h-64 sm:min-h-[360px] border-b-2 border-[#0a0a0a] sm:border-b-0 sm:border-r-2">
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
          <div className="flex h-full items-center justify-center bg-[#f5f5f5]">
            <span className="border-2 border-[#0a0a0a] bg-white px-3 py-1 font-display text-xs font-extrabold uppercase">
              Sem imagem
            </span>
          </div>
        )}
        <span
          className="absolute left-0 top-0 h-1 w-full bg-[#ffb900]"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col p-5">
        <p className="inline-block self-start bg-[#ffb900] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a] border border-[#0a0a0a]">
          Última receita
        </p>
        <h2 className="mt-3 font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.02em] text-[#0a0a0a] sm:text-3xl">
          {recipe.title}
        </h2>
        {recipe.summary && (
          <p className="mt-3 font-sans text-sm leading-6 text-[#6b6b6b]">
            {recipe.summary}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {recipe.types[0] && (
            <span className="border-2 border-[#0a0a0a] bg-white px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
              {recipe.types[0]}
            </span>
          )}
          {totalTime && (
            <span className="inline-flex items-center gap-1 border border-[#e5e5e5] bg-[#f5f5f5] px-2 py-1 font-sans text-xs text-[#0a0a0a]">
              <Clock3 className="size-3.5" /> {totalTime} min
            </span>
          )}
          <span className="inline-flex items-center gap-1 border border-[#e5e5e5] bg-[#f5f5f5] px-2 py-1 font-sans text-xs">
            <Flame className="size-3.5 text-[#ffb900]" />{' '}
            {difficultyLabel[recipe.difficulty]}
          </span>
        </div>
        {recipe.authorName && (
          <p className="mt-3 font-sans text-xs text-[#6b6b6b]">
            por{' '}
            <span className="font-bold text-[#0a0a0a]">
              {recipe.authorName}
            </span>
          </p>
        )}
        <Link
          href={`/receitas/${recipe.slug}`}
          className="mt-auto inline-flex h-12 items-center justify-center gap-2 border-2 border-[#0a0a0a] bg-[#0a0a0a] px-4 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white hover:bg-[#ffb900] hover:text-[#0a0a0a]"
        >
          Ver receita <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

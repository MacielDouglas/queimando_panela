import Link from 'next/link';
import type { RecipeListItem } from '../actions/get-all-recipes';
import Image from 'next/image';

const difficultyLabel = { EASY: 'Fácil', MEDIUM: 'Média', HARD: 'Difícil' };
const difficultyColor = {
  EASY: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HARD: 'bg-red-100 text-red-700',
};

type Props = {
  recipe: RecipeListItem;
};

export function RecipeCardItem({ recipe }: Props) {
  const cover = recipe.images[0];
  const totalTime = (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

  return (
    <Link
      href={`/receitas/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:shadow-md"
    >
      {/* Imagem ou placeholder */}
      <div className="relative h-44 w-full bg-stone-100">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            className="h-full w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🍽️</div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            {recipe.type}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColor[recipe.difficulty]}`}
          >
            {difficultyLabel[recipe.difficulty]}
          </span>
        </div>

        <h2 className="line-clamp-2 text-sm font-semibold text-stone-900 group-hover:text-amber-600">
          {recipe.title}
        </h2>

        {recipe.summary && (
          <p className="mt-1.5 line-clamp-2 text-xs text-stone-500">{recipe.summary}</p>
        )}

        {/* Footer do card */}
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-stone-400">
          {totalTime > 0 && <span>⏱ {totalTime} min</span>}
          {recipe.servings && <span>🍽 {recipe.servings} porções</span>}
          <span className="ml-auto">{recipe._count.ingredients} ingredientes</span>
        </div>
      </div>
    </Link>
  );
}

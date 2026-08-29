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
    <article
      className="qp-card-delight flex h-full flex-col overflow-hidden bg-white"
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--line)',
      }}
    >
      <Link
        href={`/receitas/${recipe.slug}`}
        aria-label={`Ver receita: ${recipe.title}`}
        className="group relative flex h-full w-full flex-col bg-white"
        tabIndex={-1}
      >
        <div
          className="relative aspect-[4/3] w-full overflow-hidden"
          style={{ background: 'var(--muted)' }}
        >
          {recipe.coverUrl ? (
            <Image
              src={recipe.coverUrl}
              alt={recipe.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ background: 'var(--muted)' }}
            >
              <span
                className="bg-white px-2 py-1 text-[0.78rem] font-bold uppercase"
                style={{
                  color: 'var(--forest)',
                  letterSpacing: '0.08em',
                  border: '1px solid var(--line)',
                  borderRadius: '999px',
                }}
              >
                Sem foto
              </span>
            </div>
          )}
          <span
            className="absolute left-0 top-0 h-1 w-full"
            style={{ background: 'var(--accent-e)' }}
            aria-hidden="true"
          />
          {recipe.types[0] && (
            <span
              className="absolute left-3 top-3 rounded-full px-2 py-1 text-[10px] font-extrabold uppercase"
              style={{
                background: 'var(--accent-e)',
                color: 'var(--forest)',
                letterSpacing: '0.08em',
              }}
            >
              {recipe.types[0]}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3
            className="line-clamp-2 font-display text-sm font-bold leading-tight tracking-[-0.01em] text-balance"
            style={{ color: 'var(--forest)' }}
          >
            {recipe.title}
          </h3>
          {recipe.summary && (
            <p
              className="line-clamp-2 text-sm leading-6"
              style={{ color: 'var(--ink-muted)', textWrap: 'pretty' }}
            >
              {recipe.summary}
            </p>
          )}
          <div
            className="mt-auto flex items-center gap-3 border-t pt-3 text-xs"
            style={{ color: 'var(--ink-muted)', borderColor: 'var(--line)' }}
          >
            {totalTime && (
              <span className="inline-flex items-center gap-1">
                <Clock3
                  className="size-3.5"
                  style={{ color: 'var(--forest)' }}
                />
                {totalTime} min
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Flame
                className="size-3.5"
                style={{ color: 'var(--accent-e)' }}
              />
              {difficultyLabel[recipe.difficulty]}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

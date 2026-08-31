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
    <article
      className="group flex h-full flex-col overflow-hidden border bg-white transition-[border-color,box-shadow]"
      style={{ borderRadius: 'var(--radius-md)', borderColor: 'var(--line)' }}
    >
      <Link
        href={`/receitas/${recipe.slug}`}
        aria-label={`Ver receita: ${recipe.title}`}
        className="relative block w-full overflow-hidden focus:outline-none"
        style={{ aspectRatio: '4 / 3', background: 'var(--muted)' }}
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
          <div className="flex h-full w-full items-center justify-center">
            <span
              className="rounded-full border bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase"
              style={{
                borderColor: 'var(--line)',
                color: 'var(--ink-muted)',
                letterSpacing: '0.12em',
              }}
            >
              Sem foto
            </span>
          </div>
        )}

        {recipe.types[0] && (
          <span
            className="absolute left-2.5 top-2.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase shadow-sm"
            style={{
              borderColor: 'rgba(27, 41, 32, 0.1)',
              background: 'var(--food-accent)',
              color: 'var(--ink)',
              letterSpacing: '0.12em',
            }}
          >
            {recipe.types[0]}
          </span>
        )}
        <span
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: 'var(--food-accent)' }}
          aria-hidden="true"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          href={`/receitas/${recipe.slug}`}
          className="rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--food-accent)] focus-visible:ring-offset-2"
        >
          <h3
            className="line-clamp-2 font-display text-[15px] font-bold uppercase leading-tight tracking-[-0.01em]"
            style={{ color: 'var(--cocoa)' }}
          >
            {recipe.title}
          </h3>
        </Link>
        {recipe.summary && (
          <p
            className="line-clamp-2 text-sm leading-6"
            style={{ color: 'var(--ink-muted)' }}
          >
            {recipe.summary}
          </p>
        )}

        <div
          className="mt-auto flex items-center gap-3 border-t pt-3 text-xs"
          style={{ borderColor: 'var(--muted)', color: 'var(--ink-muted)' }}
          aria-hidden="true"
        >
          {totalTime && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3
                className="size-3.5 shrink-0"
                style={{ color: 'var(--cocoa)' }}
                aria-hidden
              />
              {totalTime} min
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Flame
              className="size-3.5 shrink-0"
              style={{ color: 'var(--food-accent)' }}
              aria-hidden
            />
            {difficultyLabel[recipe.difficulty]}
          </span>
        </div>
      </div>
    </article>
  );
}

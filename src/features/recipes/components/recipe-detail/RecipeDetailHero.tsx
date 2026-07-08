import { Clock3, Flame, Pencil, ScrollText, Soup, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  difficultyLabel,
  type RecipeDifficultyValue,
} from '../../types/recipe.types';
import { DeleteRecipeButton } from '../DeleteRecipeButton';

type Props = {
  title: string;
  summary: string | null;
  types: string[];
  difficulty: RecipeDifficultyValue;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
  coverUrl: string | null;
  authorName: string;
  story: string | null;
  isAuthor?: boolean;
  editHref?: string;
  slug: string;
};

export function RecipeDetailHero({
  title,
  summary,
  types,
  difficulty,
  prepTimeMinutes,
  cookTimeMinutes,
  servings,
  coverUrl,
  authorName,
  story,
  isAuthor = false,
  editHref,
  slug,
}: Props) {
  const totalTime = (prepTimeMinutes ?? 0) + (cookTimeMinutes ?? 0);

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="editorial-container py-6 sm:py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,420px)] lg:items-start">
          <div className="order-2 space-y-6 lg:order-1">
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <span
                  key={t}
                  className="inline-flex min-h-9 items-center border border-amber-500 px-3 text-xs font-semibold tracking-[0.16em] text-amber-700 uppercase"
                >
                  {t}
                </span>
              ))}

              <span className="inline-flex min-h-9 items-center gap-2 border border-neutral-300 px-3 text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                {difficultyLabel[difficulty]}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl leading-tight font-bold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              {summary && (
                <p className="max-w-2xl text-base leading-7 text-neutral-700 sm:text-lg">
                  {summary}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-neutral-200 py-4 text-sm text-neutral-800">
              {totalTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Tempo total:</span>
                  <span>{totalTime} min</span>
                </div>
              )}

              {prepTimeMinutes ? (
                <div className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Preparo:</span>
                  <span>{prepTimeMinutes} min</span>
                </div>
              ) : null}

              {cookTimeMinutes ? (
                <div className="flex items-center gap-2">
                  <Soup className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Cozimento:</span>
                  <span>{cookTimeMinutes} min</span>
                </div>
              ) : null}

              {servings ? (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Porções:</span>
                  <span>{servings}</span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-neutral-600">
                Receita enviada por{' '}
                <span className="font-semibold text-neutral-900">
                  {authorName}
                </span>
              </p>

              {isAuthor && editHref ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={editHref}
                    className="inline-flex min-h-11 items-center gap-2 border border-neutral-900 bg-neutral-900 px-4 text-sm font-semibold text-white transition hover:border-amber-500 hover:bg-amber-500 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar receita
                  </Link>
                  <DeleteRecipeButton slug={slug} title={title} />
                </div>
              ) : null}
            </div>

            {story && (
              <section
                aria-labelledby="recipe-story-heading"
                className="border-l-4 border-amber-500 bg-amber-50 px-4 py-4 sm:px-5"
              >
                <h2
                  id="recipe-story-heading"
                  className="mb-2 text-xs font-semibold tracking-[0.16em] text-amber-700 uppercase"
                >
                  História da receita
                </h2>
                <p className="text-sm leading-7 text-neutral-700 sm:text-base">
                  {story}
                </p>
              </section>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-4/3 overflow-hidden border border-neutral-200 bg-neutral-100 sm:aspect-16/10 lg:aspect-square">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 420px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                  Sem imagem
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

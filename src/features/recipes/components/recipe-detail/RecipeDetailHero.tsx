import { Clock3, Flame, Pencil, Soup, Users } from 'lucide-react';
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
    <header className="border-b-2 border-[#0a0a0a] bg-white">
      <div className="h-[6px] bg-[#ffb900]" aria-hidden="true" />
      <div className="editorial-container py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_420px] lg:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <span
                  key={t}
                  className="border-2 border-[#0a0a0a] bg-[#ffb900] px-3 py-1 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]"
                >
                  {t}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 border-2 border-[#0a0a0a] bg-white px-3 py-1 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
                <Flame className="size-3.5 text-[#ffb900]" />
                {difficultyLabel[difficulty]}
              </span>
            </div>

            <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-[#0a0a0a] sm:text-5xl">
              {title}
            </h1>

            {summary && (
              <p className="max-w-2xl border-l-[6px] border-[#ffb900] pl-4 font-sans text-base leading-6 text-[#6b6b6b]">
                {summary}
              </p>
            )}

            <div className="grid grid-cols-2 gap-0 border-2 border-[#0a0a0a] bg-white sm:grid-cols-4">
              {totalTime > 0 && (
                <div className="border-r-2 border-[#0a0a0a] p-3 last:border-0">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
                    Total
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 font-display text-sm font-extrabold text-[#0a0a0a]">
                    <Clock3 className="size-4 text-[#ffb900]" /> {totalTime} min
                  </p>
                </div>
              )}
              {prepTimeMinutes ? (
                <div className="border-r-2 border-[#0a0a0a] p-3 last:border-0">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
                    Preparo
                  </p>
                  <p className="mt-1 font-display text-sm font-extrabold text-[#0a0a0a]">
                    {prepTimeMinutes} min
                  </p>
                </div>
              ) : null}
              {cookTimeMinutes ? (
                <div className="border-r-2 border-[#0a0a0a] p-3 last:border-0">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b] flex items-center gap-1">
                    <Soup className="size-3.5" /> Cozimento
                  </p>
                  <p className="mt-1 font-display text-sm font-extrabold text-[#0a0a0a]">
                    {cookTimeMinutes} min
                  </p>
                </div>
              ) : null}
              {servings ? (
                <div className="p-3">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b] flex items-center gap-1">
                    <Users className="size-3.5" /> Porções
                  </p>
                  <p className="mt-1 font-display text-sm font-extrabold text-[#0a0a0a]">
                    {servings}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-[#0a0a0a] bg-[#f5f5f5] p-3">
              <p className="font-sans text-sm text-[#6b6b6b]">
                Receita de{' '}
                <span className="font-display font-extrabold uppercase tracking-[0.08em] text-[#0a0a0a]">
                  {authorName}
                </span>
              </p>
              {isAuthor && editHref ? (
                <div className="flex gap-2">
                  <Link
                    href={editHref}
                    className="inline-flex h-10 items-center gap-2 border-2 border-[#0a0a0a] bg-[#0a0a0a] px-4 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white hover:bg-[#ffb900] hover:text-[#0a0a0a]"
                  >
                    <Pencil className="size-4" /> Editar
                  </Link>
                  <DeleteRecipeButton slug={slug} title={title} />
                </div>
              ) : null}
            </div>

            {story && (
              <section className="border-2 border-[#0a0a0a] bg-[#ffb900] p-4">
                <h2 className="font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
                  História da receita
                </h2>
                <p className="mt-2 font-sans text-sm leading-6 text-[#0a0a0a]">
                  {story}
                </p>
              </section>
            )}
          </div>

          <div className="border-2 border-[#0a0a0a] bg-white p-2">
            <div className="relative aspect-[4/3] bg-[#f5f5f5] border border-[#0a0a0a]">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
              ) : (
                <div className="grid h-full place-items-center font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
                  Sem imagem
                </div>
              )}
              <span className="absolute left-2 top-2 border-2 border-[#0a0a0a] bg-[#ffb900] px-2 py-1 font-display text-xs font-extrabold uppercase text-[#0a0a0a]">
                Panelinha
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

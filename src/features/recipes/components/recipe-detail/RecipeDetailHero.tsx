import { Clock3, Pencil, Soup, Users } from 'lucide-react';
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
    <header
      className="qp-reveal border-b bg-white"
      style={{ borderColor: 'var(--line)' }}
    >
      <div className="editorial-container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_420px] lg:items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-3 py-1.5 text-[0.78rem] font-bold uppercase transition-transform hover:-translate-y-0.5"
                  style={{
                    background: 'var(--food-accent)',
                    color: 'var(--cocoa)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {t}
                </span>
              ))}
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[0.78rem] font-bold uppercase"
                style={{
                  border: '1px solid var(--line)',
                  color: 'var(--cocoa)',
                  letterSpacing: '0.06em',
                }}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: 'var(--food-accent)' }}
                  aria-hidden
                />
                {difficultyLabel[difficulty]}
              </span>
            </div>

            <h1
              className="font-display text-[clamp(2.6rem,5vw,3.8rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-balance"
              style={{ color: 'var(--cocoa)' }}
            >
              {title}
            </h1>

            {summary && (
              <p
                className="max-w-[60ch] border-l-2 pl-4 text-[1.05rem] leading-7"
                style={{
                  borderColor: 'var(--food-accent)',
                  color: 'var(--ink-muted)',
                  textWrap: 'pretty',
                }}
              >
                {summary}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {totalTime > 0 && (
                <div
                  className="rounded-[14px] bg-white p-4 transition-transform hover:-translate-y-0.5 hover:border-[var(--food-accent)]"
                  style={{ border: '1px solid var(--line)' }}
                >
                  <p
                    className="text-[0.7rem] font-bold uppercase"
                    style={{
                      color: 'var(--ink-muted)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Total
                  </p>
                  <p
                    className="mt-1 flex items-center gap-1.5 text-sm font-extrabold"
                    style={{ color: 'var(--cocoa)' }}
                  >
                    <Clock3
                      className="size-4"
                      style={{ color: 'var(--food-accent)' }}
                    />{' '}
                    {totalTime} min
                  </p>
                </div>
              )}
              {prepTimeMinutes ? (
                <div
                  className="rounded-[14px] bg-white p-4 transition-transform hover:-translate-y-0.5 hover:border-[var(--food-accent)]"
                  style={{ border: '1px solid var(--line)' }}
                >
                  <p
                    className="text-[0.7rem] font-bold uppercase"
                    style={{
                      color: 'var(--ink-muted)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Preparo
                  </p>
                  <p
                    className="mt-1 text-sm font-extrabold"
                    style={{ color: 'var(--cocoa)' }}
                  >
                    {prepTimeMinutes} min
                  </p>
                </div>
              ) : null}
              {cookTimeMinutes ? (
                <div
                  className="rounded-[14px] bg-white p-4 transition-transform hover:-translate-y-0.5 hover:border-[var(--food-accent)]"
                  style={{ border: '1px solid var(--line)' }}
                >
                  <p
                    className="flex items-center gap-1 text-[0.7rem] font-bold uppercase"
                    style={{
                      color: 'var(--ink-muted)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    <Soup className="size-3.5" /> Cozimento
                  </p>
                  <p
                    className="mt-1 text-sm font-extrabold"
                    style={{ color: 'var(--cocoa)' }}
                  >
                    {cookTimeMinutes} min
                  </p>
                </div>
              ) : null}
              {servings ? (
                <div
                  className="rounded-[14px] bg-white p-4 transition-transform hover:-translate-y-0.5 hover:border-[var(--food-accent)]"
                  style={{ border: '1px solid var(--line)' }}
                >
                  <p
                    className="flex items-center gap-1 text-[0.7rem] font-bold uppercase"
                    style={{
                      color: 'var(--ink-muted)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    <Users className="size-3.5" /> Porções
                  </p>
                  <p
                    className="mt-1 text-sm font-extrabold"
                    style={{ color: 'var(--cocoa)' }}
                  >
                    {servings}
                  </p>
                </div>
              ) : null}
            </div>

            <div
              className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] bg-white p-4"
              style={{ border: '1px solid var(--line)' }}
            >
              <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                Receita de{' '}
                <span
                  className="font-bold"
                  style={{ color: 'var(--cocoa)', letterSpacing: '0.02em' }}
                >
                  {authorName}
                </span>
              </p>
              {isAuthor && editHref ? (
                <div className="flex gap-2">
                  <Link
                    href={editHref}
                    className="button-queimando-panela button-outline-queimando-panela h-10 px-4 text-xs"
                  >
                    <Pencil className="size-4" /> Editar
                  </Link>
                  <DeleteRecipeButton slug={slug} title={title} />
                </div>
              ) : null}
            </div>

            {story && (
              <section
                className="rounded-[14px] p-5"
                style={{ background: 'var(--cocoa)', color: 'white' }}
              >
                <h2
                  className="text-[0.78rem] font-bold uppercase"
                  style={{
                    color: 'var(--food-accent)',
                    letterSpacing: '0.08em',
                  }}
                >
                  História da receita
                </h2>
                <p
                  className="mt-2 text-sm leading-6"
                  style={{
                    color: 'rgba(255,255,255,0.82)',
                    textWrap: 'pretty',
                  }}
                >
                  {story}
                </p>
              </section>
            )}
          </div>

          <div className="group relative">
            <div
              className="relative overflow-hidden bg-white p-2 transition-shadow duration-300 group-hover:shadow-md"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--line)',
              }}
            >
              <div
                className="relative aspect-[4/3] overflow-hidden"
                style={{
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--muted)',
                }}
              >
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={title}
                    fill
                    priority
                    className="object-cover transition duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                ) : (
                  <div
                    className="grid h-full place-items-center text-[0.78rem] font-bold uppercase"
                    style={{
                      color: 'var(--ink-muted)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Sem imagem
                  </div>
                )}
                <span
                  className="absolute left-3 top-3 rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase"
                  style={{
                    background: 'var(--food-accent)',
                    color: 'var(--cocoa)',
                    letterSpacing: '0.06em',
                  }}
                >
                  Queimando Panela
                </span>
              </div>
            </div>
            <div
              className="qp-badge-float absolute -bottom-3 -right-2 hidden size-[132px] place-items-center rounded-full border-[8px] text-center lg:grid"
              style={{
                borderColor: 'var(--cream)',
                background: 'var(--food-accent)',
                color: 'var(--cocoa)',
                boxShadow: 'var(--shadow)',
                transform: 'rotate(10deg)',
              }}
              aria-hidden="true"
            >
              <span
                className="max-w-[84px] text-[0.7rem] font-bold uppercase leading-4"
                style={{ letterSpacing: '0.06em' }}
              >
                feito com cuidado
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

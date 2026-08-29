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
    <div
      className="qp-card-delight grid overflow-hidden bg-white sm:grid-cols-[1.35fr_1fr]"
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      <div
        className="relative min-h-64 overflow-hidden sm:min-h-[380px]"
        style={{ background: 'var(--muted)' }}
      >
        {recipe.coverUrl ? (
          <Image
            src={recipe.coverUrl}
            alt={recipe.title}
            fill
            priority
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, 60vw"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center"
            style={{ background: 'var(--muted)' }}
          >
            <span
              className="rounded-full bg-white px-3 py-1.5 text-[0.78rem] font-bold uppercase"
              style={{
                color: 'var(--ink-muted)',
                letterSpacing: '0.08em',
                border: '1px solid var(--line)',
              }}
            >
              Sem imagem
            </span>
          </div>
        )}
        <span
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: 'var(--accent-e)' }}
          aria-hidden="true"
        />
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.7rem] font-extrabold uppercase"
          style={{
            background: 'var(--forest)',
            color: 'white',
            letterSpacing: '0.08em',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          Em destaque
        </span>
      </div>

      <div className="flex flex-col p-6">
        <p
          className="inline-flex items-center gap-2 self-start rounded-full px-2.5 py-1 text-[0.78rem] font-bold uppercase"
          style={{
            background: 'var(--accent-e)',
            color: 'var(--forest)',
            letterSpacing: '0.08em',
          }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ background: 'var(--forest)' }}
            aria-hidden
          />
          Última receita
        </p>
        <h2
          className="mt-4 font-display text-2xl font-extrabold leading-none tracking-[-0.02em] text-balance sm:text-3xl"
          style={{ color: 'var(--forest)' }}
        >
          {recipe.title}
        </h2>
        {recipe.summary && (
          <p
            className="mt-3 line-clamp-3 text-sm leading-6"
            style={{ color: 'var(--ink-muted)', textWrap: 'pretty' }}
          >
            {recipe.summary}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {recipe.types[0] && (
            <span
              className="rounded-full px-2.5 py-1 text-[0.78rem] font-bold uppercase"
              style={{
                background: 'var(--muted)',
                color: 'var(--forest)',
                letterSpacing: '0.04em',
                border: '1px solid var(--line)',
              }}
            >
              {recipe.types[0]}
            </span>
          )}
          {totalTime && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs"
              style={{
                color: 'var(--forest)',
                border: '1px solid var(--line)',
              }}
            >
              <Clock3
                className="size-3.5 shrink-0"
                style={{ color: 'var(--ink-muted)' }}
                aria-hidden
              />{' '}
              {totalTime} min
            </span>
          )}
          <span
            className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs"
            style={{ color: 'var(--forest)', border: '1px solid var(--line)' }}
          >
            <Flame
              className="size-3.5 shrink-0"
              style={{ color: 'var(--accent-e)' }}
              aria-hidden
            />{' '}
            {difficultyLabel[recipe.difficulty]}
          </span>
        </div>
        {recipe.authorName && (
          <p
            className="mt-4 flex items-center gap-2 border-t pt-4 text-xs"
            style={{ color: 'var(--ink-muted)', borderColor: 'var(--line)' }}
          >
            <span
              className="grid size-6 place-items-center rounded-full text-[10px] font-extrabold text-white"
              style={{ background: 'var(--forest)' }}
            >
              {recipe.authorName.charAt(0).toUpperCase()}
            </span>
            por{' '}
            <span style={{ color: 'var(--forest)', fontWeight: 600 }}>
              {recipe.authorName}
            </span>
          </p>
        )}
        <Link
          href={`/receitas/${recipe.slug}`}
          className="button-queimando-panela button-primary-queimando-panela mt-6"
        >
          Ver receita
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

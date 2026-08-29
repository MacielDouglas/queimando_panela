'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

interface LatestRecipesSectionProps {
  recipes: RecipeCardData[];
}

export function LatestRecipesSection({ recipes }: LatestRecipesSectionProps) {
  const [currentRecipe, setCurrentRecipe] = useState(0);

  if (recipes.length === 0) {
    return (
      <section
        className="py-24 lg:py-28"
        style={{ background: 'var(--cream)' }}
      >
        <div className="editorial-container">
          <div className="text-center">
            <p className="eyebrow-queimando-panela mx-auto">
              O forno está aquecendo
            </p>
            <h2 className="section-title-queimando-panela mx-auto text-balance">
              Nenhuma fumaça por enquanto.
            </h2>
            <p className="section-copy mx-auto">
              Quando a primeira receita sair do forno, ela aparece aqui com foto
              grande. Que tal aquecer a cozinha?
            </p>
            <a
              href="/receitas/new"
              className="button-queimando-panela button-primary-queimando-panela mt-8 inline-flex"
            >
              Aquecer o forno
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  const visible = recipes.slice(0, 6);
  const recipe = visible[currentRecipe] ?? visible[0];

  return (
    <section className="py-24 lg:py-28" style={{ background: 'var(--cream)' }}>
      <div className="editorial-container">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="max-w-[520px]">
            <h2 className="section-title-queimando-panela">
              O que acabou de sair do forno
            </h2>
            <p
              className="mt-4 max-w-[48ch] text-[15px] leading-7"
              style={{ color: 'var(--ink-muted)' }}
            >
              Leitura leve, foto grande, foco no que importa — sem ruído.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <Link href="/receitas" className="text-link-queimando-panela">
                Ver todas
              </Link>
            </div>
          </div>

          <div>
            <Link
              href={`/receitas/${recipe.slug}`}
              className="qp-card-delight group block overflow-hidden border"
              style={{
                borderRadius: 'var(--radius-md)',
                borderColor: 'var(--line)',
              }}
              aria-label={`Ver receita: ${recipe.title}`}
            >
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: '1.15 / 1', background: 'var(--muted)' }}
              >
                {recipe.coverUrl ? (
                  <Image
                    src={recipe.coverUrl}
                    alt={recipe.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span
                      className="text-[0.78rem] font-bold uppercase"
                      style={{ color: 'var(--ink-muted)' }}
                    >
                      Sem foto
                    </span>
                  </div>
                )}
                {recipe.types[0] && (
                  <span
                    className="absolute left-4 top-4 px-3 py-[7px] text-[0.73rem] font-extrabold uppercase"
                    style={{
                      background: 'var(--accent-e)',
                      color: 'var(--ink)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {recipe.types[0]}
                  </span>
                )}
              </div>
              <div
                className="border-t bg-white p-5"
                style={{ borderColor: 'var(--line)' }}
              >
                <h3
                  className="font-display text-lg font-bold leading-tight tracking-[-0.01em]"
                  style={{ color: 'var(--forest)' }}
                >
                  {recipe.title}
                </h3>
                {recipe.summary && (
                  <p
                    className="mt-2 line-clamp-2 text-sm leading-6"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    {recipe.summary}
                  </p>
                )}
                <div
                  className="mt-4 inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase"
                  style={{ color: 'var(--forest)', letterSpacing: '0.1em' }}
                >
                  Veja →
                </div>
              </div>
            </Link>

            <div className="mt-6 flex items-center justify-between">
              <div
                className="flex gap-1"
                role="tablist"
                aria-label="Navegação de receitas"
              >
                {visible.map((r, index) => (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    aria-selected={index === currentRecipe}
                    aria-label={`Receita ${index + 1} de ${visible.length}: ${r.title}`}
                    onClick={() => setCurrentRecipe(index)}
                    className="flex items-center justify-center transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-e)] focus-visible:outline-offset-2"
                    style={{
                      minWidth: '44px',
                      minHeight: '44px',
                      padding: '0 6px',
                    }}
                  >
                    <span
                      className="block h-1 transition-all"
                      style={{
                        width: index === currentRecipe ? '32px' : '16px',
                        background:
                          index === currentRecipe
                            ? 'var(--accent-e)'
                            : 'var(--line)',
                      }}
                    />
                  </button>
                ))}
              </div>
              <p
                className="text-[0.78rem] font-bold uppercase"
                style={{ color: 'var(--ink-muted)', letterSpacing: '0.12em' }}
              >
                {String(currentRecipe + 1).padStart(2, '0')} /{' '}
                {String(visible.length).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

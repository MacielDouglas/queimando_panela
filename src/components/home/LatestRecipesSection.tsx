'use client';

import { ArrowRight } from 'lucide-react';
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
      <section className="bg-white py-16 lg:py-24">
        <div className="editorial-container">
          <div className="text-center">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
              Últimas receitas
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,1.2rem+2vw,2.8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[#0a0a0a] text-wrap-balance">
              Saiu do forno
            </h2>
            <p className="mt-4 mx-auto max-w-[48ch] font-sans text-[15px] leading-7 text-[#6b6b6b]">
              Quando a primeira receita for publicada, ela aparece aqui com foto
              grande e leitura leve.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const visible = recipes.slice(0, 6);
  const recipe = visible[currentRecipe] ?? visible[0];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="editorial-container">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-[520px]">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
              Últimas receitas
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,1.2rem+2vw,2.8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[#0a0a0a] text-wrap-balance">
              O que acabou de sair do forno
            </h2>
            <p className="mt-4 max-w-[48ch] font-sans text-[15px] leading-7 text-[#6b6b6b] text-wrap-pretty">
              Leitura leve, foto grande, foco no que importa — sem ruído.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/receitas"
                className="group inline-flex items-center gap-3 font-display text-sm font-extrabold uppercase tracking-[0.1em] text-[#0a0a0a]"
              >
                Ver todas
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-[#0a0a0a] transition-colors group-hover:bg-[#ffb900]">
                  <ArrowRight className="size-4 text-[#0a0a0a]" />
                </span>
              </Link>
            </div>
          </div>

          <div>
            <Link
              href={`/receitas/${recipe.slug}`}
              className="group block overflow-hidden rounded-[12px] border border-[#e5e5e5] transition-[border-color,box-shadow] hover:border-[#0a0a0a] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2"
              aria-label={`Ver receita: ${recipe.title}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
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
                  <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5]">
                    <span className="font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
                      Sem foto
                    </span>
                  </div>
                )}
                {recipe.types[0] && (
                  <span className="absolute left-4 top-4 bg-[#ffb900] px-3 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
                    {recipe.types[0]}
                  </span>
                )}
              </div>
              <div className="border-t border-[#e5e5e5] bg-white p-5">
                <h3 className="font-display text-lg font-extrabold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a] text-wrap-balance">
                  {recipe.title}
                </h3>
                {recipe.summary && (
                  <p className="mt-2 line-clamp-2 font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
                    {recipe.summary}
                  </p>
                )}
                <div className="mt-4 inline-flex items-center gap-2 font-display text-xs font-extrabold uppercase tracking-[0.1em] text-[#0a0a0a]">
                  Veja
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </Link>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-2">
                {visible.map((_, index) => (
                  <button
                    key={visible[index].id}
                    type="button"
                    onClick={() => setCurrentRecipe(index)}
                    className={`h-1 transition-all ${
                      index === currentRecipe
                        ? 'w-8 bg-[#ffb900]'
                        : 'w-4 bg-[#e5e5e5] hover:bg-[#0a0a0a]'
                    }`}
                    aria-label={`Receita ${index + 1}`}
                  />
                ))}
              </div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
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

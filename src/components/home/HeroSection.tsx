'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

interface HeroSectionProps {
  featuredRecipe: RecipeCardData | null;
}

export function HeroSection({ featuredRecipe }: HeroSectionProps) {
  if (!featuredRecipe) {
    return (
      <section className="border-t-[6px] border-[#ffb900] bg-white">
        <div className="editorial-container py-12 lg:py-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div>
              <p className="inline-block bg-[#ffb900] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
                Queimando Panela
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-[#0a0a0a] sm:text-5xl lg:text-6xl">
                A Estapar
                <br />
                <span className="bg-[#ffb900] px-1">da cozinha</span>
                <br />
                brasileira
              </h1>
              <p className="mt-4 max-w-lg font-sans text-base leading-6 text-[#6b6b6b]">
                Receitas reais, quadradas e amarelas. Sem pop-up, sem enrolação.
                A Panelinha que a Estapar faria se vendesse panela.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/receitas"
                  className="inline-flex h-12 items-center border border-[#0a0a0a] bg-[#0a0a0a] px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-[#0a0a0a]"
                >
                  Ver receitas
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex h-12 items-center border border-[#0a0a0a] bg-white px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#ffb900]"
                >
                  Enviar receita
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] border-2 border-[#0a0a0a] bg-[#f5f5f5] p-2">
              <div className="flex h-full w-full items-center justify-center border border-dashed border-[#e5e5e5] bg-white">
                <span className="font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
                  Nenhuma receita em destaque
                </span>
              </div>
              <div
                className="absolute -right-2 -top-2 size-4 bg-[#ffb900] border border-[#0a0a0a]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t-[6px] border-[#ffb900] bg-white">
      <div className="editorial-container py-8 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* Texto Estapar */}
          <div>
            <p className="inline-flex items-center gap-2 bg-[#ffb900] px-3 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
              <span className="size-1.5 bg-[#0a0a0a]" aria-hidden="true" />
              Receita em destaque
            </p>

            {featuredRecipe.types[0] && (
              <p className="mt-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
                {featuredRecipe.types[0]} • Panelinha do dia
              </p>
            )}

            <h1 className="mt-3 font-display text-3xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-[#0a0a0a] sm:text-4xl lg:text-5xl">
              {featuredRecipe.title}
            </h1>

            {featuredRecipe.summary && (
              <p className="mt-4 max-w-xl font-sans text-base leading-6 text-[#6b6b6b]">
                {featuredRecipe.summary}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/receitas/${featuredRecipe.slug}`}
                className="inline-flex h-12 items-center border border-[#0a0a0a] bg-[#0a0a0a] px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white hover:bg-[#ffb900] hover:text-[#0a0a0a] hover:border-[#ffb900]"
              >
                Ver receita completa
              </Link>
              <Link
                href="/receitas"
                className="inline-flex h-12 items-center border border-[#e5e5e5] bg-white px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:border-[#0a0a0a]"
              >
                Todas as receitas
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4 border-t border-[#e5e5e5] pt-4">
              <span className="h-10 w-10 bg-[#0a0a0a] text-white grid place-items-center font-display text-xs font-extrabold">
                QP
              </span>
              <div>
                <p className="font-display text-xs font-extrabold uppercase tracking-[0.1em] text-[#0a0a0a]">
                  Queimando Panela
                </p>
                <p className="font-sans text-xs text-[#6b6b6b]">
                  Cozinha real, sem filtro
                </p>
              </div>
            </div>
          </div>

          {/* Imagem quadrada Estapar */}
          <Link
            href={`/receitas/${featuredRecipe.slug}`}
            className="group relative block border-2 border-[#0a0a0a] bg-white p-2 hover:border-[#ffb900]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
              {featuredRecipe.coverUrl ? (
                <Image
                  src={featuredRecipe.coverUrl}
                  alt={featuredRecipe.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5] font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
                  Sem foto
                </div>
              )}
              <div className="absolute left-2 top-2 bg-[#ffb900] px-2 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] border border-[#0a0a0a]">
                Destaque
              </div>
            </div>
            <div
              className="absolute -right-2 -top-2 size-3 bg-[#ffb900] border border-[#0a0a0a]"
              aria-hidden="true"
            />
            <div
              className="absolute -left-2 -bottom-2 size-3 bg-[#0a0a0a]"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

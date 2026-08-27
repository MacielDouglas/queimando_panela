'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

interface GastronomySectionProps {
  recipes: RecipeCardData[];
}

const pillars = [
  {
    title: 'Receitas de família',
    description:
      'Pratos que passam de geração em geração, guardando memórias e sabores.',
  },
  {
    title: 'Ingredientes locais',
    description:
      'Valorizamos o que é da terra, o que enche a despensa e o coração.',
  },
  {
    title: 'Tradição viva',
    description: 'Cada receita é um pedaço de história que merece ser contada.',
  },
];

export function GastronomySection({ recipes }: GastronomySectionProps) {
  const featuredRecipes = recipes.slice(0, 3);

  return (
    <section className="bg-[#0a0a0a] py-16 lg:py-24">
      <div className="editorial-container">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-[520px]">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#ffb900]">
              Gastronomia
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,1.2rem+2vw,2.8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-white text-wrap-balance">
              Raízes e história
            </h2>
            <p className="mt-5 max-w-[48ch] font-sans text-[15px] leading-7 text-white/70 text-wrap-pretty">
              Faça uma viagem sensorial no tempo pelas tradições culinárias.
              Saboreie as tortas salgadas, o orgulho da culinária caseira.
              Aproveite o café da manhã, uma fonte atemporal de energia.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/receitas"
                className="group inline-flex items-center gap-3 font-display text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:text-[#ffb900]"
              >
                Descobrir
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:border-[#ffb900] group-hover:bg-[#ffb900] group-hover:text-[#0a0a0a]">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </div>

            <ul className="mt-10 grid gap-4">
              {pillars.map((pillar) => (
                <li
                  key={pillar.title}
                  className="border-l-2 border-white/20 pl-5 transition-colors hover:border-[#ffb900]"
                >
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.1em] text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-6 text-white/60">
                    {pillar.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {featuredRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/receitas/${recipe.slug}`}
                className="group block overflow-hidden rounded-[12px] border border-white/10 transition-[border-color,box-shadow] hover:border-[#ffb900] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                aria-label={`Ver receita: ${recipe.title}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                  {recipe.coverUrl ? (
                    <Image
                      src={recipe.coverUrl}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5">
                      <span className="font-display text-xs font-bold uppercase tracking-[0.12em] text-white/40">
                        Sem foto
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-display text-xs font-extrabold uppercase leading-tight tracking-[0.05em] text-white text-wrap-balance">
                      {recipe.title}
                    </h3>
                    {recipe.types[0] && (
                      <p className="mt-1 font-sans text-[10px] text-white/60">
                        {recipe.types[0]}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

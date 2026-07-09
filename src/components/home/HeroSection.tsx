'use client';

import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSectionProps {
  featuredRecipe: RecipeCardData | null;
}

export function HeroSection({ featuredRecipe }: HeroSectionProps) {
  if (!featuredRecipe) {
    return (
      <section aria-labelledby="hero-recipe-title">
        <div className="relative mx-auto flex aspect-4/3 max-w-7xl items-center justify-center bg-linear-to-br from-amber-100 to-amber-50 sm:aspect-video lg:aspect-21/9">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-200/60" aria-hidden="true">
              <svg viewBox="0 0 64 64" className="size-8 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="1.5" y="1.5" width="61" height="61" rx="4" />
                <path d="M16 25.5C16 19.7 20.5 16 26.6 16C32.7 16 37.2 19.8 37.2 25.5C37.2 31.3 32.7 35.2 26.6 35.2C20.5 35.2 16 31.3 16 25.5ZM21 25.5C21 28.7 23.2 31 26.6 31C30 31 32.2 28.7 32.2 25.5C32.2 22.4 30 20.2 26.6 20.2C23.2 20.2 21 22.4 21 25.5ZM29.8 32.8L37.6 40.8" />
                <path d="M41 16V41M41 16H49.8C55.1 16 58 19.2 58 23.9C58 28.6 55.1 31.8 49.8 31.8H41" />
              </svg>
            </div>
            <h2 id="hero-recipe-title" className="text-xl font-bold tracking-tight text-amber-900 sm:text-2xl lg:text-3xl">
              Queimando Panela
            </h2>
            <p className="mt-2 max-w-md px-4 text-sm leading-relaxed text-amber-700">
              Nenhuma receita em destaque no momento. Volte em breve para descobrir novos pratos.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="hero-recipe-title">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <Link
          href={`/receitas/${featuredRecipe.slug}`}
          aria-label={`Ver receita em destaque: ${featuredRecipe.title}`}
          className="group relative mx-auto block aspect-4/3 max-w-7xl overflow-hidden bg-neutral-900 sm:aspect-video lg:aspect-21/9"
        >
          {/* Imagem de capa */}
          {featuredRecipe.coverUrl ? (
            <Image
              src={featuredRecipe.coverUrl}
              alt={featuredRecipe.title}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-100 to-amber-50"
              aria-hidden="true"
            >
              <svg viewBox="0 0 64 64" className="size-12 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1.5" y="1.5" width="61" height="61" rx="4" />
                <path d="M16 25.5C16 19.7 20.5 16 26.6 16C32.7 16 37.2 19.8 37.2 25.5C37.2 31.3 32.7 35.2 26.6 35.2C20.5 35.2 16 31.3 16 25.5ZM21 25.5C21 28.7 23.2 31 26.6 31C30 31 32.2 28.7 32.2 25.5C32.2 22.4 30 20.2 26.6 20.2C23.2 20.2 21 22.4 21 25.5ZM29.8 32.8L37.6 40.8" />
                <path d="M41 16V41M41 16H49.8C55.1 16 58 19.2 58 23.9C58 28.6 55.1 31.8 49.8 31.8H41" />
              </svg>
            </div>
          )}

          {/* Overlay gradiente — separado da imagem para não bloquear o alt */}
          <div
            className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-neutral-950/30 to-transparent"
            aria-hidden="true"
          />

          {/* Conteúdo textual sobre o overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-12">
            <div className="mx-auto max-w-4xl">
              {/* Badge de categoria */}
              {featuredRecipe.types[0] && (
                <p className="mb-3">
                  <span className="inline-block border border-amber-300 bg-amber-50/90 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-amber-800 uppercase backdrop-blur-sm">
                    {featuredRecipe.types[0]}
                  </span>
                </p>
              )}

              {/* Título — h2 com id para o aria-labelledby da section */}
              <h2
                id="hero-recipe-title"
                className="text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl lg:text-5xl"
              >
                {featuredRecipe.title}
              </h2>

              {/* Resumo */}
              {featuredRecipe.summary && (
                <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base lg:text-lg">
                  {featuredRecipe.summary}
                </p>
              )}

              {/* CTA */}
              <span
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors duration-200 group-hover:text-amber-300 sm:text-base"
                aria-hidden="true" // aria-label no <Link> já descreve a ação
              >
                Ver receita
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}

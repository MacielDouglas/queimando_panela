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
  if (!featuredRecipe) return null;

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
              className="flex h-full w-full items-center justify-center bg-neutral-200"
              aria-hidden="true"
            >
              <span className="text-sm text-neutral-400">Sem imagem</span>
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

import Image from 'next/image';
import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

interface HeroSectionProps {
  featuredRecipe: RecipeCardData | null;
}

export function HeroSection({ featuredRecipe }: HeroSectionProps) {
  if (!featuredRecipe) {
    return (
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="editorial-container py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-[60ch]">
              <p className="inline-block bg-[#ffb900] px-2.5 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
                Queimando Panela
              </p>
              <h1 className="mt-5 font-display text-[clamp(2rem,1.4rem+2.2vw,3.2rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-[#0a0a0a] text-wrap-balance">
                A panela que ensina — com IA que confere
              </h1>
              <p className="mt-4 max-w-[55ch] font-sans text-[15px] leading-7 text-[#6b6b6b] text-wrap-pretty">
                Receitas de família com leitura leve, história preservada e
                análise inteligente. Sem anúncio no meio da frase.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/receitas"
                  className="inline-flex min-h-11 items-center rounded-none border border-[#0a0a0a] bg-[#0a0a0a] px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-[#0a0a0a]"
                >
                  Ver receitas
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex min-h-11 items-center rounded-none border border-[#e5e5e5] bg-white px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:border-[#0a0a0a]"
                >
                  Enviar receita com IA
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-[#f5f5f5] p-2">
              <div className="flex h-full w-full items-center justify-center rounded-[8px] border border-dashed border-[#e5e5e5] bg-white">
                <span className="font-display text-xs font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
                  Nenhuma receita em destaque
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-[#e5e5e5] bg-white">
      <div className="editorial-container py-10 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-[60ch]">
            <p className="inline-flex items-center gap-2 bg-[#ffb900] px-2.5 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
              <span className="size-1.5 bg-[#0a0a0a]" aria-hidden />
              Receita em destaque
            </p>
            {featuredRecipe.types[0] && (
              <p className="mt-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#6b6b6b]">
                {featuredRecipe.types[0]} • Escolha da cozinha
              </p>
            )}
            <h1 className="mt-3 font-display text-[clamp(1.7rem,1.2rem+1.6vw,2.8rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-[#0a0a0a] text-wrap-balance">
              {featuredRecipe.title}
            </h1>
            {featuredRecipe.summary && (
              <p className="mt-4 max-w-[52ch] font-sans text-[15px] leading-7 text-[#6b6b6b] text-wrap-pretty">
                {featuredRecipe.summary}
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/receitas/${featuredRecipe.slug}`}
                className="inline-flex min-h-11 items-center rounded-none bg-[#0a0a0a] px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#ffb900] hover:text-[#0a0a0a]"
              >
                Ver receita completa
              </Link>
              <Link
                href="/receitas"
                className="inline-flex min-h-11 items-center rounded-none border border-[#e5e5e5] bg-white px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:border-[#0a0a0a]"
              >
                Todas as receitas
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-[#e5e5e5] pt-4">
              <span className="grid size-9 place-items-center bg-[#0a0a0a] font-display text-xs font-extrabold text-white">
                QP
              </span>
              <div>
                <p className="font-display text-xs font-extrabold uppercase tracking-[0.1em] text-[#0a0a0a]">
                  Queimando Panela
                </p>
                <p className="font-sans text-xs leading-5 text-[#6b6b6b]">
                  Leitura leve, história preservada
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/receitas/${featuredRecipe.slug}`}
            className="group block overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white p-2 transition-colors hover:border-[#0a0a0a]"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-[#f5f5f5]">
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
              <span className="absolute left-3 top-3 bg-[#ffb900] px-2 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
                Destaque
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

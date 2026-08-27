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
            <div className="max-w-[62ch]">
              <p className="inline-flex items-center gap-2 bg-[#ffb900] px-2.5 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
                <span
                  className="size-1.5 rounded-full bg-[#0a0a0a]"
                  aria-hidden
                />
                Queimando Panela — blog com IA
              </p>
              <h1 className="mt-5 font-display text-[clamp(2.1rem,1.3rem+2.4vw,3.4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-[#0a0a0a] text-wrap-balance">
                A panela que ensina —
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">com IA que confere</span>
                  <span
                    className="absolute inset-x-0 bottom-[0.12em] h-[0.42em] bg-[#ffb900]/70"
                    aria-hidden
                  />
                </span>
              </h1>
              <p className="mt-4 max-w-[58ch] font-sans text-[15px] leading-7 text-[#6b6b6b] text-wrap-pretty">
                Receitas de família com leitura leve, história preservada e
                análise inteligente de utensílios, tempo e nutrição. Sem anúncio
                no meio da frase.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/receitas"
                  className="inline-flex min-h-12 items-center rounded-none border-2 border-[#0a0a0a] bg-[#0a0a0a] px-7 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2"
                >
                  Ver receitas
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex min-h-12 items-center rounded-none border border-[#e5e5e5] bg-white px-7 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:border-[#0a0a0a] hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a]"
                >
                  Enviar receita com IA
                </Link>
              </div>
              <p className="mt-4 font-sans text-xs leading-5 text-[#6b6b6b]">
                Já com análise de tempo, utensílios e tabela por 100g — editável
                antes de publicar.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-[#0a0a0a]">
                <Image
                  src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80"
                  alt="Mesa de cozinha com ingredientes e caderno de receitas"
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 45vw"
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <p className="inline-flex bg-[#ffb900] px-2 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
                    Comece por aqui
                  </p>
                  <p className="mt-2 max-w-[28ch] font-display text-sm font-bold uppercase leading-tight text-white text-wrap-balance">
                    Nenhuma receita em destaque ainda — publique a primeira e
                    apareça aqui.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-[#e5e5e5] bg-white">
      <div className="editorial-container py-12 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-[62ch] pt-1">
            <p className="inline-flex items-center gap-2 rounded-none bg-[#ffb900] px-2.5 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
              <span
                className="size-1.5 rounded-full bg-[#0a0a0a]"
                aria-hidden
              />
              Receita em destaque
            </p>
            {featuredRecipe.types[0] && (
              <p className="mt-4 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#6b6b6b]">
                {featuredRecipe.types[0]} • Escolha da cozinha
              </p>
            )}
            <h1 className="mt-3 font-display text-[clamp(1.9rem,1.2rem+1.8vw,3rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-[#0a0a0a] text-wrap-balance">
              {featuredRecipe.title}
            </h1>
            {featuredRecipe.summary && (
              <p className="mt-4 max-w-[54ch] font-sans text-[15px] leading-7 text-[#6b6b6b] text-wrap-pretty">
                {featuredRecipe.summary}
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/receitas/${featuredRecipe.slug}`}
                className="inline-flex min-h-12 items-center justify-center rounded-none bg-[#0a0a0a] px-7 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#ffb900] hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2"
              >
                Ver receita completa
              </Link>
              <Link
                href="/receitas"
                className="inline-flex min-h-12 items-center justify-center rounded-none border border-[#e5e5e5] bg-white px-7 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:border-[#0a0a0a] hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a]"
              >
                Todas as receitas
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3 border-t border-[#e5e5e5] pt-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-[#0a0a0a] font-display text-xs font-extrabold tracking-wide text-white">
                QP
              </span>
              <div className="min-w-0">
                <p className="font-display text-xs font-extrabold uppercase tracking-[0.1em] text-[#0a0a0a]">
                  Queimando Panela
                </p>
                <p className="font-sans text-xs leading-5 text-[#6b6b6b]">
                  Leitura leve, história preservada — IA confere, você publica
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/receitas/${featuredRecipe.slug}`}
            className="group block overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white p-2 transition-[border-color,transform] hover:border-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2"
            aria-label={`Ver receita: ${featuredRecipe.title}`}
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
              <span className="absolute left-3 top-3 rounded-none border border-[#0a0a0a] bg-[#ffb900] px-2.5 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] shadow-sm">
                Destaque
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

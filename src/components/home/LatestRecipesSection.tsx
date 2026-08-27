import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

interface LatestRecipesSectionProps {
  recipes: RecipeCardData[];
}

export function LatestRecipesSection({ recipes }: LatestRecipesSectionProps) {
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

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="editorial-container">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#e5e5e5] pb-8">
          <div className="max-w-[520px]">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
              Últimas receitas
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,1.2rem+2vw,2.8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[#0a0a0a] text-wrap-balance">
              O que acabou de sair do forno
            </h2>
          </div>
          <Link
            href="/receitas"
            className="group inline-flex min-h-12 items-center gap-3 border border-[#e5e5e5] bg-white px-6 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:border-[#0a0a0a] hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900]"
          >
            Ver todas
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          {visible.map((recipe, index) => (
            <li key={recipe.id}>
              <Link
                href={`/receitas/${recipe.slug}`}
                className="group block overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white transition-[border-color,box-shadow] hover:border-[#0a0a0a] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb900] focus-visible:ring-offset-2"
                aria-label={`Ver receita: ${recipe.title}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                  {recipe.coverUrl ? (
                    <Image
                      src={recipe.coverUrl}
                      alt={recipe.title}
                      fill
                      priority={index < 3}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                <div className="p-5">
                  <h3 className="font-display text-lg font-extrabold uppercase leading-tight tracking-[-0.01em] text-[#0a0a0a] decoration-[#ffb900] decoration-2 underline-offset-4 group-hover:underline text-wrap-balance">
                    {recipe.title}
                  </h3>
                  {recipe.summary && (
                    <p className="mt-2 line-clamp-2 font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
                      {recipe.summary}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

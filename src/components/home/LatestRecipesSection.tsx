import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';
import CardRecipe from './CardRecipe';

interface LatestRecipesSectionProps {
  recipes: RecipeCardData[];
}

export function LatestRecipesSection({ recipes }: LatestRecipesSectionProps) {
  if (recipes.length === 0) {
    return (
      <section className="border-t border-[#e5e5e5] bg-[#f5f5f5]">
        <div className="editorial-container py-16 lg:py-20">
          <div className="flex items-end justify-between gap-4 border-b border-[#e5e5e5] pb-6">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
                Últimas receitas
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.015em] text-[#0a0a0a] sm:text-3xl text-wrap-balance">
                Saiu do forno
              </h2>
            </div>
            <span
              className="hidden h-1 w-24 bg-[#ffb900] sm:block"
              aria-hidden
            />
          </div>
          <div className="mt-8 grid place-items-center rounded-[12px] border border-[#e5e5e5] bg-white px-6 py-16 text-center">
            <div className="max-w-[48ch]">
              <p className="mx-auto grid size-10 place-items-center rounded-full bg-[#f5f5f5] font-display text-xs font-extrabold text-[#0a0a0a]">
                QP
              </p>
              <h3 className="mt-3 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
                Nenhuma receita ainda
              </h3>
              <p className="mx-auto mt-2 max-w-[42ch] font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
                Quando a primeira receita for publicada, ela aparece aqui com
                foto grande e leitura leve.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const visible = recipes.slice(0, 8);

  return (
    <section className="border-t border-[#e5e5e5] bg-white">
      <div className="editorial-container py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5e5] pb-6">
          <div className="max-w-[60ch]">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
              Últimas receitas
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.015em] text-[#0a0a0a] text-wrap-balance sm:text-3xl">
              O que acabou de sair do forno
            </h2>
            <p className="mt-2 max-w-[55ch] font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
              Leitura leve, foto grande, foco no que importa — sem ruído.
            </p>
          </div>
          <Link
            href="/receitas"
            className="group inline-flex min-h-11 items-center gap-2 rounded-none border border-[#e5e5e5] bg-white px-5 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:border-[#0a0a0a] hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a]"
          >
            Ver todas{' '}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="mt-8 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {visible.map((recipe, index) => (
            <li key={recipe.id}>
              <CardRecipe recipe={recipe} priority={index < 4} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

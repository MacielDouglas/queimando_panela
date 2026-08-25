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
          <div className="flex items-end justify-between gap-4 border-b-2 border-[#0a0a0a] pb-4">
            <div>
              <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#6b6b6b]">
                Últimas receitas
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.01em] text-[#0a0a0a] sm:text-3xl">
                Saiu do forno
              </h2>
            </div>
          </div>
          <div className="mt-8 grid place-items-center border-2 border-dashed border-[#e5e5e5] bg-white py-16">
            <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
              Nenhuma receita ainda
            </p>
          </div>
        </div>
      </section>
    );
  }

  const visible = recipes.slice(0, 8);

  return (
    <section className="border-t border-[#e5e5e5] bg-white">
      <div className="editorial-container py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#0a0a0a] pb-4">
          <div>
            <p className="inline-block bg-[#0a0a0a] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Queimando Panela
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.01em] text-[#0a0a0a] sm:text-3xl">
              O que acabou de sair do forno
            </h2>
            <p className="mt-2 font-sans text-sm text-[#6b6b6b]">
              Grid Queimando Panela 3 colunas, ritmo Queimando Panela
            </p>
          </div>
          <Link
            href="/receitas"
            className="inline-flex h-10 items-center gap-2 border border-[#0a0a0a] bg-white px-4 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
          >
            Ver todas <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((recipe, index) => (
            <li
              key={recipe.id}
              className={index === 0 ? 'lg:col-span-2 lg:row-span-1' : ''}
            >
              <CardRecipe recipe={recipe} priority={index < 4} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

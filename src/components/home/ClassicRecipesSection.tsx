import type { RecipeCardData } from '@/features/recipes/actions/get-all-recipes';

import CardRecipe from './CardRecipe';

interface ClassicRecipeRow {
  type: string;
  recipes: RecipeCardData[];
}

interface ClassicRecipesSectionProps {
  rows: ClassicRecipeRow[];
}

export function ClassicRecipesSection({ rows }: ClassicRecipesSectionProps) {
  if (rows.length === 0) {
    return (
      <section aria-labelledby="classic-recipes-title">
        <div className="mx-auto max-w-7xl border-t px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <header className="mb-10 border-b border-neutral-200 pb-5">
            <h2 id="classic-recipes-title" className="mt-1 text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">Receitas que nunca saem de moda</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">Quatro categorias tradicionais, uma receita de cada — para matar a saudade ou descobrir pela primeira vez.</p>
          </header>
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-neutral-100" aria-hidden="true">
              <svg className="size-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-600">Nenhuma receita clássica cadastrada.</p>
            <p className="mt-1 text-sm text-neutral-400">Em breve, receitas tradicionais organizadas por categoria.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="classic-recipes-title">
      <div className="mx-auto max-w-7xl border-t px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Cabeçalho principal da seção */}
        <header className="mb-10 border-b border-neutral-200 pb-5">
          <h2
            id="classic-recipes-title"
            className="mt-1 text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl"
          >
            Receitas que nunca saem de moda
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
            Quatro categorias tradicionais, uma receita de cada — para matar a
            saudade ou descobrir pela primeira vez.
          </p>
        </header>
        {/* Grade 2x2 com categoria em destaque — bento para clássicos */}
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {rows.map((row) => (
            <li
              key={row.type}
              className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-5"
            >
              <p className="mb-3 border-b border-neutral-100 pb-2 text-xs font-semibold tracking-[0.16em] text-amber-700 uppercase">
                {row.type}
              </p>
              {row.recipes.map((recipe, index) => (
                <CardRecipe
                  key={recipe.id}
                  recipe={recipe}
                  priority={index < 4}
                />
              ))}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

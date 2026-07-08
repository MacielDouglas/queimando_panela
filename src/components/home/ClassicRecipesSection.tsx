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
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="classic-recipes-title">
      <div className="mx-auto max-w-7xl border-t px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Cabeçalho principal da seção */}
        <header className="mb-10 border-b border-neutral-200 pb-5">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-amber-700 uppercase">
            Clássicos
          </p>
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
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
        >
          {rows.map((recipe) => (
            <li key={recipe.type}>
              <p className="font-medium text-amber-700 uppercase">
                {recipe.type}
              </p>
              {recipe.recipes.map((items, index) => (
                <CardRecipe
                  key={items.id}
                  recipe={items}
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

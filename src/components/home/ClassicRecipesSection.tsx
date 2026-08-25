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
      <section className="border-t border-[#e5e5e5] bg-[#f5f5f5]">
        <div className="editorial-container py-12 lg:py-16">
          <div className="border-l-[6px] border-[#ffb900] pl-4">
            <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-[#0a0a0a] sm:text-3xl">
              Clássicos que nunca saem de moda
            </h2>
            <p className="mt-2 max-w-xl font-sans text-sm text-[#6b6b6b]">
              Quatro categorias Estapar, uma receita Panelinha por faixa.
            </p>
          </div>
          <div className="mt-8 grid place-items-center border-2 border-dashed border-[#e5e5e5] bg-white py-16">
            <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
              Nenhuma clássica cadastrada
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[#e5e5e5] bg-[#f5f5f5]">
      <div className="editorial-container py-12 lg:py-16">
        <div className="border-l-[6px] border-[#ffb900] pl-4">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#6b6b6b]">
            Estapar Panelinha
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold uppercase leading-none text-[#0a0a0a] sm:text-3xl">
            Clássicos que nunca saem de moda
          </h2>
          <p className="mt-2 max-w-xl font-sans text-sm text-[#6b6b6b]">
            Faixa Estapar, conteúdo Panelinha — bento 2x2 quadrado.
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rows.map((row) => (
            <li key={row.type} className="border border-[#0a0a0a] bg-white p-4">
              <p className="inline-block bg-[#ffb900] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
                {row.type}
              </p>
              <div className="mt-3">
                {row.recipes.map((recipe, index) => (
                  <CardRecipe
                    key={recipe.id}
                    recipe={recipe}
                    priority={index < 2}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

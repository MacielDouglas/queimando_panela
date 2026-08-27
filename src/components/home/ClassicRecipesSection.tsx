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
        <div className="editorial-container py-16 lg:py-20">
          <div className="max-w-[60ch] border-t-2 border-[#ffb900] pt-6">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
              Clássicos
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.015em] text-[#0a0a0a] sm:text-3xl text-wrap-balance">
              Clássicos que nunca saem de moda
            </h2>
            <p className="mt-2 max-w-xl font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
              Quatro categorias Queimando Panela, uma receita por faixa —
              curadoria lenta, não feed infinito.
            </p>
          </div>
          <div className="mt-8 grid place-items-center rounded-[12px] border border-[#e5e5e5] bg-white px-6 py-16 text-center">
            <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
              Nenhuma clássica cadastrada
            </p>
            <p className="mt-2 max-w-[40ch] font-sans text-sm leading-6 text-[#6b6b6b]">
              Assim que houver tipos com receitas publicadas, as 4 faixas
              aparecem aqui.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[#e5e5e5] bg-[#f5f5f5]">
      <div className="editorial-container py-16 lg:py-20">
        <div className="max-w-[62ch] border-t-2 border-[#ffb900] pt-6">
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
            Queimando Panela
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.015em] text-[#0a0a0a] sm:text-3xl text-wrap-balance">
            Clássicos que nunca saem de moda
          </h2>
          <p className="mt-2 max-w-[60ch] font-sans text-sm leading-6 text-[#6b6b6b] text-wrap-pretty">
            Faixa Queimando Panela, conteúdo Queimando Panela — bento 2×2 com
            respiro, não grade corporativa.
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {rows.map((row) => (
            <li
              key={row.type}
              className="overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white p-4 transition-colors hover:border-[#0a0a0a] hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="h-1 w-8 bg-[#ffb900]" aria-hidden />
                <p className="font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
                  {row.type}
                </p>
              </div>
              <div className="mt-4">
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

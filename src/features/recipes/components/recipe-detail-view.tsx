import type { RecipeDetail } from '../actions/get-recipe';
import { RecipeHero } from './RecipeHero';
import { RecipeMetrics } from './RecipeMetrics';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeNutrition } from './RecipeNutrition';
import { RecipeUtensils } from './RecipeUtensilis';
import { RecipeSteps } from './RecipeSteps';

type Props = { recipe: RecipeDetail };

export function RecipeDetailView({ recipe }: Props) {
  return (
    <article className="pb-20">
      {/* ── Hero: imagem, badges, título, resumo ── */}
      <RecipeHero recipe={recipe} />

      {/* ── Métricas: tempos, porções, ingredientes ── */}
      <div className="mt-8">
        <RecipeMetrics
          prepTimeMinutes={recipe.prepTimeMinutes}
          cookTimeMinutes={recipe.cookTimeMinutes}
          servings={recipe.servings}
          ingredientsCount={recipe.ingredients.length}
        />
      </div>

      {/* ── Conteúdo principal ── */}
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="grid gap-12 md:grid-cols-[280px_1fr]">
          {/* ── Sidebar ── */}
          <aside className="space-y-6">
            <RecipeIngredients ingredients={recipe.ingredients} />
            <RecipeUtensils utensils={recipe.utensils} />
          </aside>

          {/* ── Instruções e demais seções ── */}
          <div className="space-y-10">
            <RecipeSteps modeOfPreparation={recipe.modeOfPreparation} />

            {recipe.story && (
              <section className="rounded-2xl bg-stone-50 p-6">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-stone-400">
                  História
                </h2>
                <p className="text-sm italic leading-relaxed text-stone-500">{recipe.story}</p>
              </section>
            )}

            {recipe.suggestions && (
              <section>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-stone-400">
                  Sugestões
                </h2>
                <p className="text-sm leading-relaxed text-stone-600">{recipe.suggestions}</p>
              </section>
            )}

            {/* ── Tabela nutricional ── */}
            <RecipeNutrition
              nutritionPer100g={recipe.nutritionPer100g}
              nutritionSummary={recipe.nutritionSummary}
            />

            {recipe.notesPublic && (
              <section>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-stone-400">
                  Notas
                </h2>
                <p className="text-sm leading-relaxed text-stone-600">{recipe.notesPublic}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

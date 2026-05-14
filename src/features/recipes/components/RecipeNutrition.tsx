import { NutritionTable } from './NutritionTable';
import type { NutritionRow } from '@/server/ai/groq/recipe-generator.types';

type Props = {
  nutritionPer100g: unknown;
  nutritionSummary: string | null;
};

export function RecipeNutrition({ nutritionPer100g, nutritionSummary }: Props) {
  const rows = Array.isArray(nutritionPer100g) ? (nutritionPer100g as NutritionRow[]) : [];
  if (!rows.length) return null;

  return (
    <section>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-stone-400">
        Informação nutricional
      </h2>
      <NutritionTable rows={rows} summary={nutritionSummary ?? ''} />
    </section>
  );
}

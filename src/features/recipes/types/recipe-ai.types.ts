import type { z } from "zod";
import type { aiRecipeAnalysisSchema } from "../schemas/recipe-ai.schema";

export type AiRecipeAnalysis = z.infer<typeof aiRecipeAnalysisSchema>;

// Sub-tipos para uso em componentes sem importar o schema completo
export type AiIngredient =
  AiRecipeAnalysis["sections"][number]["ingredients"][number];
export type AiRecipeStep = AiRecipeAnalysis["sections"][number]["steps"][];
export type AiRecipeSection = AiRecipeAnalysis["sections"][number];
export type NutritionRow = NonNullable<
  AiRecipeAnalysis["nutritionPer100g"]
>[number];

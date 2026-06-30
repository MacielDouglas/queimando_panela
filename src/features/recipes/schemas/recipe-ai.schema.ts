import { z } from "zod";
import {
  CLASSIFICATION_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "../types/recipe.types";

// Ingrediente já "limpo" pela IA — alimenta Ingredient + GeneralIngredient
export const aiIngredientSchema = z.object({
  originalText: z.string().trim().min(1),
  name: z.string().trim().min(1),
  generalName: z.string().trim().min(1), // → GeneralIngredient.name (normalizado em lower)
});

// Utensílio — alimenta Utensil + UtensilOnRecipe
export const aiUtensilSchema = z.object({
  name: z.string().trim().min(1),
});

// Seção — alimenta RecipeSection + Ingredient[]
export const aiSectionSchema = z.object({
  name: z.string().trim().min(1),
  ingredients: z.array(aiIngredientSchema),
  modeOfPreparation: z.string().trim().min(1), // → RecipeSection.modeOfPreparation
  steps: z
    .array(
      z.object({
        order: z.number().int().nonnegative(),
        text: z.string().trim().min(1),
      }),
    )
    .optional(), // → RecipeStep[]  (opcional para compatibilidade com IA atual)
});

// Nutrição — cada linha: { nutrient, quantity }
// Serializada em Recipe.nutritionPer100g (Json)
export const nutritionRowSchema = z.object({
  nutrient: z.string().trim().min(1),
  quantity: z.string().trim().min(1),
});

// Resposta completa da IA
export const aiRecipeAnalysisSchema = z.object({
  // Recipe principal
  title: z.string().trim().min(1), // → Recipe.title
  summary: z.string().trim().min(1).max(500), // → Recipe.summary
  history: z.string().trim().min(1).max(500), // → Recipe.story
  difficulty: z.enum(
    DIFFICULTY_OPTIONS.map((o) => o.value) as [string, ...string[]],
  ),
  // → Recipe.difficulty (RecipeDifficulty)
  difficultyLabel: z.string().trim().min(1), // apenas display, não persiste

  // Tempos → Recipe.prepTimeMinutes / cookTimeMinutes
  prepTimeMinutes: z.number().int().min(0),
  cookTimeMinutes: z.number().int().min(0),

  // Sugestões e notas
  suggestions: z.string().trim().min(1), // → Recipe.suggestions
  nutritionSummary: z.string().trim().min(1).max(200), // → Recipe.nutritionSummary
  nutritionPer100g: z.array(nutritionRowSchema).optional(), // → Recipe.nutritionPer100g

  // Classificação → RecipeClassification.name (upsert por name)
  classification: z.object({
    label: z.enum(CLASSIFICATION_OPTIONS), // → RecipeClassification.name
    brazilianState: z.string().trim().nullable(), // → Recipe.consumptionSummary (parte)
    worldOrigin: z.string().trim().nullable(), // → WorldOrigin.name
  }),

  // Tipos de receita → RecipeType.name[] (upsert)
  types: z.array(z.string().trim().min(1)).min(1).max(5), // → RecipeTypeOnRecipe

  // Utensílios → Utensil.name[] (upsert)
  utensils: z.array(aiUtensilSchema).optional(), // → UtensilOnRecipe

  // Seções → RecipeSection[] + Ingredient[]
  sections: z.array(aiSectionSchema).min(1),
});

export type AiIngredientSchema = z.infer<typeof aiIngredientSchema>;
export type AiSectionSchema = z.infer<typeof aiSectionSchema>;
export type AiRecipeAnalysisSchema = z.infer<typeof aiRecipeAnalysisSchema>;

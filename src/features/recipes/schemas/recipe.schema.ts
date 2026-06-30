import { z } from "zod";
import {
  CLASSIFICATION_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "../types/recipe.types";
import {
  aiIngredientSchema,
  aiUtensilSchema,
  nutritionRowSchema,
} from "./recipe-ai.schema";

/* ---------------------------------------------------------------
   Schema de entrada bruta (passo 1: o usuário digita a receita)
   Alimenta apenas as sections como texto livre para envio à IA.
--------------------------------------------------------------- */
export const rawSectionSchema = z.object({
  name: z.string().max(120, "Nome da etapa muito longo").optional(),
  ingredientsText: z.string().min(1, "Ingredientes obrigatórios"),
  modeOfPreparation: z.string().min(1, "Modo de preparo obrigatório"),
});

export const recipeFormSchema = z.object({
  title: z.string().min(3, "Título deve ter ao menos 3 caracteres"),
  story: z.string().max(500, "Máximo 500 caracteres").optional(),
  sections: z.array(rawSectionSchema).min(1, "Ao menos uma etapa obrigatória"),
});

/* ---------------------------------------------------------------
   Schema de revisão da IA (passo 2: usuário ajusta o resultado)
   Cada campo mapeia diretamente a um campo do schema.prisma.
--------------------------------------------------------------- */

// Seção com ingredientes estruturados e modo de preparo revisável
export const aiReviewSectionSchema = z.object({
  name: z.string().trim().min(1, "Nome da etapa obrigatório"),
  ingredients: z.array(aiIngredientSchema),
  modeOfPreparation: z.string().trim().min(1, "Modo de preparo obrigatório"),
});

export const aiReviewFormSchema = z.object({
  // Recipe.title
  title: z.string().trim().min(1, "Título obrigatório"),

  // Recipe.summary (VarChar 500)
  summary: z
    .string()
    .trim()
    .min(1, "Resumo obrigatório")
    .max(500, "Máximo 500 caracteres"),

  // Recipe.story
  history: z
    .string()
    .trim()
    .min(1, "História obrigatória")
    .max(500, "Máximo 500 caracteres"),

  // Recipe.difficulty
  difficulty: z.enum(
    DIFFICULTY_OPTIONS.map((o) => o.value) as [string, ...string[]],
  ),

  // Apenas display — não persiste no banco
  difficultyLabel: z.string().trim().min(1),

  // RecipeType.name[] via RecipeTypeOnRecipe
  types: z.array(z.string().trim().min(1)).min(1).max(5),

  // RecipeClassification.name + WorldOrigin.name + Recipe.consumptionSummary
  classification: z.object({
    label: z.enum(CLASSIFICATION_OPTIONS),
    brazilianState: z.string().trim().nullable(),
    worldOrigin: z.string().trim().nullable(),
  }),

  // Recipe.prepTimeMinutes / cookTimeMinutes
  prepTimeMinutes: z.number().int().min(0),
  cookTimeMinutes: z.number().int().min(0),

  // Recipe.suggestions
  suggestions: z.string().trim().min(1, "Sugestões obrigatórias"),

  // Recipe.nutritionSummary
  nutritionSummary: z.string().trim().min(1).max(200),

  // Recipe.nutritionPer100g (Json)
  nutritionPer100g: z.array(nutritionRowSchema).optional(),

  // Utensil[] via UtensilOnRecipe
  utensils: z.array(aiUtensilSchema).optional(),

  // RecipeSection[] + Ingredient[]
  sections: z.array(aiReviewSectionSchema).min(1),
});

// Tipos exportados para uso em componentes
export type RecipeFormData = z.infer<typeof recipeFormSchema>;
export type AiReviewFormData = z.infer<typeof aiReviewFormSchema>;

import { z } from "zod";
import { DIFFICULTY_OPTIONS } from "../types/recipe.types";

// Ingrediente pronto para criar Ingredient no Prisma
export const dbIngredientSchema = z.object({
  originalText: z.string().min(1),
  name: z.string().min(1),
  generalIngredientName: z.string().min(1), // → GeneralIngredient.name (upsert, normalizado)
  order: z.number().int().nonnegative(),
});

// Seção pronta para criar RecipeSection + Ingredient[]
export const dbSectionSchema = z.object({
  name: z.string().min(1),
  modeOfPreparation: z.string().min(1),
  ingredients: z.array(dbIngredientSchema),
  order: z.number().int().nonnegative(),
});

// Payload completo validado antes de chamar prisma.$transaction
export const dbRecipePayloadSchema = z.object({
  slug: z.string().min(1).max(150),
  title: z.string().min(1).max(180),
  summary: z.string().max(500).nullable(),
  story: z.string().nullable(), // Recipe.story
  difficulty: z.enum(
    DIFFICULTY_OPTIONS.map((o) => o.value) as [string, ...string[]],
  ),
  prepTimeMinutes: z.number().int().nonnegative().nullable(),
  cookTimeMinutes: z.number().int().nonnegative().nullable(),
  suggestions: z.string().nullable(),
  nutritionSummary: z.string().nullable(),
  nutritionPer100g: z // Recipe.nutritionPer100g Json?
    .array(z.object({ nutrient: z.string(), quantity: z.string() }))
    .nullable(),
  classificationName: z.string().nullable(), // RecipeClassification.name
  worldOriginName: z.string().nullable(), // WorldOrigin.name
  recipeTypeNames: z.array(z.string().min(1)), // RecipeType.name[]
  utensilNames: z.array(z.string().min(1)), // Utensil.name[]
  sections: z.array(dbSectionSchema).min(1),
  authorId: z.string().uuid(),
  isPublished: z.boolean(),
});

export type DbRecipePayload = z.infer<typeof dbRecipePayloadSchema>;

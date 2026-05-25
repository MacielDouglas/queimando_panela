import { z } from 'zod';

export const aiReviewIngredientSchema = z.object({
  text: z.string(),
});

export const aiReviewUtensilSchema = z.object({
  name: z.string(),
});

export const aiReviewSectionSchema = z.object({
  name: z.string(),
  ingredients: z.array(aiReviewIngredientSchema),
  modeOfPreparation: z.string(),
});

export const aiReviewSchema = z.object({
  title: z.string(),
  summary: z.string(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  difficultyLabel: z.string(),
  types: z.array(z.string()).min(1).max(3),
  prepTimeMinutes: z.number(),
  cookTimeMinutes: z.number(),
  suggestions: z.string(),
  nutritionSummary: z.string(),
  nutritionPer100g: z.array(
    z.object({
      nutrient: z.string(),
      quantity: z.string(),
    }),
  ),
  utensils: z.array(aiReviewUtensilSchema),
  sections: z.array(aiReviewSectionSchema),
});

export type AiReviewFormData = z.infer<typeof aiReviewSchema>;

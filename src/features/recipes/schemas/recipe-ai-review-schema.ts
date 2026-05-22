import { z } from 'zod';

export const aiReviewSectionSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.object({ text: z.string() })),
  modeOfPreparation: z.string(),
});

export const aiReviewSchema = z.object({
  title: z.string().min(1),
  summary: z.string(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  difficultyLabel: z.string(),
  type: z.string(),
  prepTimeMinutes: z.number(),
  cookTimeMinutes: z.number(),
  suggestions: z.string(),
  nutritionSummary: z.string(),
  nutritionPer100g: z.array(
    z.object({ nutrient: z.string(), quantity: z.string() }),
  ),
  utensils: z.array(z.object({ name: z.string() })),
  sections: z.array(aiReviewSectionSchema),
});

export type AiReviewFormData = z.infer<typeof aiReviewSchema>;

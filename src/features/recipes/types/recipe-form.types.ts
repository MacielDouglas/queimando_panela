import type { z } from "zod";
import type {
  aiReviewFormSchema,
  recipeFormSchema,
} from "../schemas/recipe.schema";

export type RecipeFormData = z.infer<typeof recipeFormSchema>;
export type AiReviewFormData = z.infer<typeof aiReviewFormSchema>;

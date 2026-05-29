import type { RecipeDifficultyValue } from './recipe.types';

export type NutritionRow = {
  nutrient: string;
  quantity: string;
};

export type AiIngredient = {
  originalText: string;
  name: string;
  generalName: string;
};

export type AiSection = {
  name: string;
  ingredients: AiIngredient[];
  modeOfPreparation: string;
};

export type AiRecipeAnalysis = {
  title: string;
  summary: string;
  difficulty: RecipeDifficultyValue;
  difficultyLabel: string;
  types: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  suggestions: string;
  nutritionSummary: string;
  nutritionPer100g: NutritionRow[];
  utensils: string[];
  sections: AiSection[];
};

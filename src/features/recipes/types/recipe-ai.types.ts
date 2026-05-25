export type NutritionRow = {
  nutrient: string;
  quantity: string;
};

export type AiRecipeAnalysis = {
  title: string;
  summary: string;
  difficulty: 'EASY' | 'EASY_MEDIUM' | 'MEDIUM' | 'MEDIUM_HARD' | 'HARD';
  difficultyLabel: string;
  types: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  suggestions: string;
  nutritionSummary: string;
  nutritionPer100g: { nutrient: string; quantity: string }[];
  utensils: string[];
  sections: {
    name: string;
    ingredients: string[];
    modeOfPreparation: string;
  }[];
};
export type AiSection = {
  name: string;
  ingredients: string[];
  modeOfPreparation: string;
};

export type NutritionRow = {
  nutrient: string;
  quantity: string;
};

export type AiRecipeAnalysis = {
  title: string;
  summary: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  difficultyLabel: string;
  type: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  suggestions: string;
  nutritionSummary: string;
  nutritionPer100g: NutritionRow[];
  utensils: string[];
  sections: AiSection[];
};

export type AiSection = {
  name: string;
  ingredients: string[];
  modeOfPreparation: string;
};

export type NutritionRow = {
  nutrient: string;
  amount: string;
  unit: string;
  dailyValue?: string;
};

export type GeneratedIngredient = {
  amount: string;
  unit: string;
  name: string;
  originalText: string;
  inferred: boolean;
  suggestions: string[];
};

export type GeneratedClassification = {
  primaryGroup: 'CARBOIDRATOS' | 'REGULADORES' | 'CONSTRUTORES' | 'CALCIO' | 'LIPIDIOS' | 'OUTROS';
  mainCategories: string[];
  nutritionTags: string[];
  courseTypes: string[];
  typeSuggestions: string[];
};

export type GeneratedRecipeData = {
  modeOfPreparation: string;
  summary: string;
  nutritionSummary: string;
  nutritionTable: NutritionRow[];
  ingredients: GeneratedIngredient[];
  utensils: { name: string }[];
  classification: GeneratedClassification;
  suggestions: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  cookTimeMinutes: number | null;
};

export type GenerateRecipeRequest = {
  title: string;
  modeOfPreparation: string;
};

export type ParsedIngredient = {
  id?: string;
  name: string;
  amount: string | null;
  unit: string | null;
  originalText?: string;
  inferred?: boolean;
  suggestions?: string[];
};

export type ParsedUtensil = {
  name: string;
};

export type ParsedClassification = {
  primaryGroup: string;
  mainCategories: string[];
  nutritionTags: string[];
  courseTypes: string[];
  typeSuggestions: string[];
};

export type ParseRecipeResponse = {
  ingredients: ParsedIngredient[];
  utensils: ParsedUtensil[];
  classification: ParsedClassification;
};

export type CreateRecipeActionState = {
  status: 'idle' | 'error';
  message: string;
};

export const initialCreateRecipeState: CreateRecipeActionState = {
  status: 'idle',
  message: '',
};

export type UpdateRecipeActionState = {
  status: 'idle' | 'error';
  message: string;
};

export const initialUpdateRecipeState: UpdateRecipeActionState = {
  status: 'idle',
  message: '',
};

import type { RecipeDifficultyValue } from '@/features/recipes/types/recipe.types';

type RecipeTypeItem = {
  recipeType: {
    name: string;
  };
};

type RecipeImageItem = {
  url: string;
  alt?: string | null;
  isCover: boolean;
  order: number;
};

type RecipeUtensilItem = {
  utensil: {
    name: string;
  };
};

type RecipeSectionIngredientItem = {
  id: string;
  originalText: string;
  order: number;
  generalIngredient?: {
    name: string;
  } | null;
};

type RecipeSectionItem = {
  id: string;
  name: string;
  modeOfPreparation: string;
  ingredients: RecipeSectionIngredientItem[];
};

type RecipeAuthor = {
  id?: string;
  name: string | null;
};

export type RecipeMock = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  story: string | null;
  difficulty: RecipeDifficultyValue;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  createdAt: Date;
  servings: number | null;
  isPublished: boolean;
  authorId: string | null;
  author: RecipeAuthor | null;
  images: RecipeImageItem[];
  recipeTypes: RecipeTypeItem[];
  utensils: RecipeUtensilItem[];
  sections: RecipeSectionItem[];
  ingredients: Array<string | { originalText: string; order?: number }>;
  nutritionSummary: string | null;
  nutritionPer100g: Array<{ nutrient: string; quantity: string }>;
  suggestions: string | null;
};

export function makeRecipeMock(
  overrides: Partial<RecipeMock> = {},
): RecipeMock {
  return {
    id: 'recipe-1',
    slug: 'bolo-de-milho',
    title: 'Bolo de milho',
    summary: 'Fofo e cremoso',
    story: 'Receita de família',
    difficulty: 'EASY',
    prepTimeMinutes: 15,
    cookTimeMinutes: 45,
    createdAt: new Date('2026-05-22T12:00:00.000Z'),
    servings: 8,
    isPublished: true,
    authorId: 'user-1',
    author: { id: 'user-1', name: 'Douglas' },
    images: [
      {
        url: '/bolo.jpg',
        alt: 'Bolo de milho',
        isCover: true,
        order: 0,
      },
    ],
    recipeTypes: [{ recipeType: { name: 'Bolo' } }],
    utensils: [{ utensil: { name: 'Forma' } }],
    sections: [
      {
        id: 'section-1',
        name: 'Massa',
        modeOfPreparation: 'Misture os ingredientes e asse.',
        ingredients: [
          { id: 'i1', originalText: '2 xícaras de milho', order: 0 },
          { id: 'i2', originalText: '1 xícara de leite', order: 1 },
        ],
      },
    ],
    ingredients: [
      { originalText: '2 xícaras de milho', order: 0 },
      { originalText: '1 xícara de leite', order: 1 },
    ],
    nutritionSummary: 'Resumo nutricional',
    nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
    suggestions: 'Troque leite integral por desnatado.',
    ...overrides,
  };
}

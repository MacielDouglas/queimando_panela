import type { AiReviewFormData } from '../../schemas/recipe-ai-review-schema';
import type { RecipeDifficultyValue } from '../../types/recipe.types';
import type { AiRecipeAnalysis } from '../../types/recipe-ai.types';
import type { RecipeFormWithImages } from './fields/ImageUploadField';

export type EditableRecipeImage = {
  id: string;
  key: string;
  url: string;
  alt: string;
  isCover: boolean;
  order: number;
};

export type EditableIngredient = {
  originalText: string;
  name: string;
  generalName: string;
};

export type EditableRecipeData = {
  id: string;
  slug: string;
  title: string;
  story: string;
  summary: string;
  difficulty: RecipeDifficultyValue;
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
    ingredients: EditableIngredient[];
    modeOfPreparation: string;
  }[];
  images: EditableRecipeImage[];
};

export function normalizeDifficulty(
  difficulty: AiRecipeAnalysis['difficulty'],
): RecipeDifficultyValue {
  if (
    difficulty === 'EASY' ||
    difficulty === 'MEDIUM' ||
    difficulty === 'HARD'
  ) {
    return difficulty;
  }
  if (difficulty === 'EASY_MEDIUM') return 'MEDIUM';
  if (difficulty === 'MEDIUM_HARD') return 'HARD';
  return 'MEDIUM';
}

export function aiAnalysisToFormData(data: AiRecipeAnalysis): AiReviewFormData {
  return {
    ...data,
    difficulty: normalizeDifficulty(data.difficulty),
    utensils: data.utensils.map((name) => ({ name })),
    sections: data.sections.map((section) => ({
      name: section.name,
      modeOfPreparation: section.modeOfPreparation,
      ingredients: section.ingredients.map((ingredient) => ({
        originalText: ingredient.originalText,
        name: ingredient.name,
        generalName: ingredient.generalName,
      })),
    })),
  };
}

export function formDataToAnalysis(data: AiReviewFormData): AiRecipeAnalysis {
  return {
    ...data,
    utensils: data.utensils.map((u) => u.name).filter(Boolean),
    sections: data.sections.map((section) => ({
      name: section.name,
      modeOfPreparation: section.modeOfPreparation,
      ingredients: section.ingredients
        .filter((i) => i.originalText?.trim().length > 0)
        .map((i) => {
          const originalText = i.originalText.trim();
          const name = i.name?.trim() || originalText;
          const generalName =
            i.generalName?.trim().toLowerCase() || name.toLowerCase();
          return { originalText, name, generalName };
        }),
    })),
  };
}

export function editableRecipeToFormDefaults(
  initialData?: EditableRecipeData,
): RecipeFormWithImages {
  if (!initialData) {
    return {
      title: '',
      story: '',
      sections: [
        {
          id: crypto.randomUUID(),
          name: '',
          ingredientsText: '',
          modeOfPreparation: '',
        },
      ],
      images: [],
    };
  }

  return {
    title: initialData.title,
    story: initialData.story,
    sections:
      initialData.sections.length > 0
        ? initialData.sections.map((section) => ({
            id: crypto.randomUUID(),
            name: section.name,
            ingredientsText: section.ingredients
              .map((ing) => ing.originalText)
              .join('\n'),
            modeOfPreparation: section.modeOfPreparation,
          }))
        : [
            {
              id: crypto.randomUUID(),
              name: '',
              ingredientsText: '',
              modeOfPreparation: '',
            },
          ],
    images:
      initialData.images?.map((image, index) => ({
        kind: 'existing' as const,
        id: image.id,
        key: image.key,
        url: image.url,
        alt: image.alt,
        isCover: image.isCover,
        order: image.order ?? index,
      })) ?? [],
  };
}

export function editableRecipeToReviewDefaults(
  initialData?: EditableRecipeData,
): AiReviewFormData | undefined {
  if (!initialData) return undefined;
  return {
    title: initialData.title,
    summary: initialData.summary,
    difficulty: initialData.difficulty,
    difficultyLabel: initialData.difficultyLabel,
    types: initialData.types,
    prepTimeMinutes: initialData.prepTimeMinutes,
    cookTimeMinutes: initialData.cookTimeMinutes,
    suggestions: initialData.suggestions,
    nutritionSummary: initialData.nutritionSummary,
    nutritionPer100g: initialData.nutritionPer100g,
    utensils: initialData.utensils.map((name) => ({ name })),
    sections: initialData.sections.map((section) => ({
      name: section.name,
      modeOfPreparation: section.modeOfPreparation,
      ingredients: section.ingredients.map((ingredient) => ({
        originalText: ingredient.originalText,
        name: ingredient.name,
        generalName: ingredient.generalName,
      })),
    })),
  };
}

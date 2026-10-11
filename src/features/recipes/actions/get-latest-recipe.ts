'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';
import { mapToRecipeCardData, recipeCardSelect } from './recipe-card-select';

export const getLatestRecipe = cache(
  async (): Promise<RecipeCardData | null> => {
    try {
      const recipe = await prisma.recipe.findFirst({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        select: recipeCardSelect,
      });

      if (!recipe) return null;
      return mapToRecipeCardData(recipe);
    } catch (error) {
      if (process.env.NODE_ENV === 'production')
        console.error('[getLatestRecipe] fallback:', error);
      return null;
    }
  },
);

'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';
import { mapToRecipeCardData, recipeCardSelect } from './recipe-card-select';

export const getLatestRecipes = cache(
  async (take = 3): Promise<RecipeCardData[]> => {
    try {
      const safeTake = Math.min(Math.max(take, 1), 12);
      const recipes = await prisma.recipe.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: safeTake,
        select: recipeCardSelect,
      });

      return recipes.map(mapToRecipeCardData);
    } catch (error) {
      // Fallback para build sem DB migrado (P2021) — evita quebrar `next build` na Vercel/CI
      if (process.env.NODE_ENV === 'production')
        console.error('[getLatestRecipes] fallback:', error);
      return [];
    }
  },
);

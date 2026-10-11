'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';
import { mapToRecipeCardData, recipeCardSelect } from './recipe-card-select';

type ClassicRecipeRow = {
  type: string;
  recipes: RecipeCardData[];
};

export const getClassicRecipes = cache(
  async (typesCount = 4, recipesPerType = 1): Promise<ClassicRecipeRow[]> => {
    try {
      const safeTypesCount = Math.min(Math.max(typesCount, 1), 8);
      const safeRecipesPerType = Math.min(Math.max(recipesPerType, 1), 6);

      const publishedTypes = await prisma.recipeType.findMany({
        where: {
          recipes: {
            some: { recipe: { isPublished: true } },
          },
        },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
        take: safeTypesCount,
      });

      if (publishedTypes.length === 0) return [];

      // Ordem determinística para permitir ISR/CDN. Sorteio, se desejado, no client.
      // Lote único em vez de N+1: 1 query com `in` + agrupamento em JS.
      const items = await prisma.recipe.findMany({
        where: {
          isPublished: true,
          recipeTypes: {
            some: { recipeTypeId: { in: publishedTypes.map((t) => t.id) } },
          },
        },
        orderBy: { createdAt: 'desc' },
        // Buffer 4x para distribuir entre os tipos no agrupamento em JS.
        take: Math.min(safeTypesCount * safeRecipesPerType * 4, 96),
        select: recipeCardSelect,
      });

      const byTypeId = new Map<string, typeof items>();
      for (const item of items) {
        for (const rt of item.recipeTypes) {
          const list = byTypeId.get(rt.recipeType.name) ?? [];
          list.push(item);
          byTypeId.set(rt.recipeType.name, list);
        }
      }

      return publishedTypes
        .map((recipeType) => ({
          type: recipeType.name,
          recipes: (byTypeId.get(recipeType.name) ?? [])
            .slice(0, safeRecipesPerType)
            .map(mapToRecipeCardData),
        }))
        .filter((row) => row.recipes.length > 0);
    } catch (error) {
      if (process.env.NODE_ENV === 'production')
        console.error('[getClassicRecipes] fallback:', error);
      return [];
    }
  },
);

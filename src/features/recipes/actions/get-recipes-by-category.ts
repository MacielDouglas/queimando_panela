'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';
import { mapToRecipeCardData, recipeCardSelect } from './recipe-card-select';

type CategoryRow = {
  type: string;
  recipes: RecipeCardData[];
};

export const getRecipesByCategory = cache(
  async (take = 4): Promise<CategoryRow[]> => {
    try {
      const safeTake = Math.min(Math.max(take, 1), 12);
      // Busca direta dos tipos que têm receita publicada — sem varrer todas as receitas.
      const types = await prisma.recipeType.findMany({
        where: { recipes: { some: { recipe: { isPublished: true } } } },
        orderBy: { name: 'asc' },
        take: 4,
        select: { id: true, name: true },
      });

      if (types.length === 0) return [];

      // Lote único em vez de N+1: 1 query com `in` + agrupamento em JS.
      const items = await prisma.recipe.findMany({
        where: {
          isPublished: true,
          recipeTypes: {
            some: { recipeTypeId: { in: types.map((t) => t.id) } },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: Math.min(types.length * safeTake * 4, 96),
        select: recipeCardSelect,
      });

      const byType = new Map<string, typeof items>();
      for (const item of items) {
        for (const rt of item.recipeTypes) {
          const list = byType.get(rt.recipeType.name) ?? [];
          list.push(item);
          byType.set(rt.recipeType.name, list);
        }
      }

      return types
        .map((t) => ({
          type: t.name,
          recipes: (byType.get(t.name) ?? [])
            .slice(0, safeTake)
            .map(mapToRecipeCardData),
        }))
        .filter((row) => row.recipes.length > 0);
    } catch (error) {
      if (process.env.NODE_ENV === 'production')
        console.error('[getRecipesByCategory] fallback:', error);
      return [];
    }
  },
);

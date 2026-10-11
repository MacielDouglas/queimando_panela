'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';
import { mapToRecipeCardData, recipeCardSelect } from './recipe-card-select';

type UtensilRow = {
  utensilName: string;
  recipes: RecipeCardData[];
};

export const getRecipesByUtensil = cache(
  async (take = 4): Promise<UtensilRow[]> => {
    try {
      const safeTake = Math.min(Math.max(take, 1), 12);
      const utensils = await prisma.utensil.findMany({
        where: {
          recipes: {
            some: {
              recipe: { isPublished: true },
            },
          },
        },
        orderBy: { name: 'asc' },
        take: 4,
        select: { id: true, name: true },
      });

      if (utensils.length === 0) return [];

      // Lote único em vez de N+1.
      // Nota: o select do card não traz utensílios; buscamos IDs em lote
      // numa segunda query leve e agrupamos em JS.
      const [items, links] = await Promise.all([
        prisma.recipe.findMany({
          where: {
            isPublished: true,
            utensils: {
              some: { utensilId: { in: utensils.map((u) => u.id) } },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: Math.min(utensils.length * safeTake * 4, 96),
          select: recipeCardSelect,
        }),
        prisma.utensilOnRecipe.findMany({
          where: {
            utensilId: { in: utensils.map((u) => u.id) },
            recipe: { isPublished: true },
          },
          select: { recipeId: true, utensilId: true },
          take: 400,
        }),
      ]);

      const recipeIdsByUtensil = new Map<string, string[]>();
      for (const link of links) {
        const list = recipeIdsByUtensil.get(link.utensilId) ?? [];
        list.push(link.recipeId);
        recipeIdsByUtensil.set(link.utensilId, list);
      }

      const itemById = new Map(items.map((item) => [item.id, item]));

      return utensils
        .map((utensil) => ({
          utensilName: utensil.name,
          recipes: (recipeIdsByUtensil.get(utensil.id) ?? [])
            .map((id) => itemById.get(id))
            .filter((item) => item !== undefined)
            .slice(0, safeTake)
            .map(mapToRecipeCardData),
        }))
        .filter((row) => row.recipes.length > 0);
    } catch (error) {
      if (process.env.NODE_ENV === 'production')
        console.error('[getRecipesByUtensil] fallback:', error);
      return [];
    }
  },
);

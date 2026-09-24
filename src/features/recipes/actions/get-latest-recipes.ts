'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';

export const getLatestRecipes = cache(
  async (take = 3): Promise<RecipeCardData[]> => {
    try {
      const safeTake = Math.min(Math.max(take, 1), 12);
      const recipes = await prisma.recipe.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: safeTake,
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          difficulty: true,
          prepTimeMinutes: true,
          cookTimeMinutes: true,
          createdAt: true,
          images: {
            orderBy: { order: 'asc' },
            take: 2,
            select: { url: true, isCover: true, order: true },
          },
          author: { select: { name: true } },
          recipeTypes: {
            select: { recipeType: { select: { name: true } } },
          },
        },
      });

      return recipes.map((recipe) => {
        const cover =
          recipe.images.find((img) => img.isCover) ?? recipe.images[0] ?? null;

        return {
          id: recipe.id,
          slug: recipe.slug,
          title: recipe.title,
          summary: recipe.summary,
          types: recipe.recipeTypes.map((rt) => rt.recipeType.name),
          difficulty: recipe.difficulty,
          prepTimeMinutes: recipe.prepTimeMinutes,
          cookTimeMinutes: recipe.cookTimeMinutes,
          createdAt: recipe.createdAt,
          coverUrl: cover?.url ?? null,
          authorName: recipe.author?.name ?? null,
        } satisfies RecipeCardData;
      });
    } catch (error) {
      // Fallback para build sem DB migrado (P2021) — evita quebrar `next build` na Vercel/CI
      if (process.env.NODE_ENV === 'production')
        console.error('[getLatestRecipes] fallback:', error);
      return [];
    }
  },
);

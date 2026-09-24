'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';

export const getLatestRecipe = cache(
  async (): Promise<RecipeCardData | null> => {
    try {
      const recipe = await prisma.recipe.findFirst({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
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

      if (!recipe) return null;

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
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'production')
        console.error('[getLatestRecipe] fallback:', error);
      return null;
    }
  },
);

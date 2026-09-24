'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';

type ClassicRecipeRow = {
  type: string;
  recipes: RecipeCardData[];
};

export const getClassicRecipes = cache(
  async (typesCount = 4, recipesPerType = 1): Promise<ClassicRecipeRow[]> => {
    try {
      const publishedTypes = await prisma.recipeType.findMany({
        where: {
          recipes: {
            some: { recipe: { isPublished: true } },
          },
        },
        include: {
          _count: {
            select: { recipes: { where: { recipe: { isPublished: true } } } },
          },
        },
        orderBy: { name: 'asc' },
      });

      if (publishedTypes.length === 0) return [];

      const safeTypesCount = Math.min(Math.max(typesCount, 1), 8);
      const safeRecipesPerType = Math.min(Math.max(recipesPerType, 1), 6);
      // Ordem determinística para permitir ISR/CDN. Sorteio, se desejado, no client.
      const selectedTypes = publishedTypes.slice(0, safeTypesCount);

      const rows = await Promise.all(
        selectedTypes.map(async (recipeType) => {
          const items = await prisma.recipe.findMany({
            where: {
              isPublished: true,
              recipeTypes: {
                some: { recipeTypeId: recipeType.id },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: safeRecipesPerType,
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

          return {
            type: recipeType.name,
            recipes: items.map((recipe) => {
              const cover =
                recipe.images.find((img) => img.isCover) ??
                recipe.images[0] ??
                null;

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
            }),
          };
        }),
      );

      return rows.filter((row) => row.recipes.length > 0);
    } catch (error) {
      if (process.env.NODE_ENV === 'production')
        console.error('[getClassicRecipes] fallback:', error);
      return [];
    }
  },
);

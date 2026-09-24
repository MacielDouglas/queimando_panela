'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { RecipeCardData } from './get-all-recipes';

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
        select: { name: true },
      });

      const distinctTypes = types.map((t) => t.name);

      const rows = await Promise.all(
        distinctTypes.map(async (type) => {
          const items = await prisma.recipe.findMany({
            where: {
              isPublished: true,
              recipeTypes: {
                some: {
                  recipeType: { name: type },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: safeTake, // <- aqui o parâmetro é de fato usado
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
            type,
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
        console.error('[getRecipesByCategory] fallback:', error);
      return [];
    }
  },
);

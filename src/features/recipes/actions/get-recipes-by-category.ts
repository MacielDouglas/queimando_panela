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
    // Busca todas as receitas publicadas com tipos definidos
    const published = await prisma.recipe.findMany({
      where: {
        isPublished: true,
        types: { isEmpty: false },
      },
      orderBy: { createdAt: 'desc' },
      select: { types: true },
    });

    // Extrai os primeiros 4 tipos distintos (preservando ordem de aparição)
    const seen = new Set<string>();
    for (const { types } of published) {
      for (const t of types) {
        if (!seen.has(t)) seen.add(t);
        if (seen.size >= 4) break;
      }
      if (seen.size >= 4) break;
    }

    const distinctTypes = Array.from(seen);

    const rows = await Promise.all(
      distinctTypes.map(async (type) => {
        const items = await prisma.recipe.findMany({
          where: {
            isPublished: true,
            types: { has: type },
          },
          orderBy: { createdAt: 'desc' },
          take,
          include: {
            images: { orderBy: { order: 'asc' } },
            author: { select: { name: true } },
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
              types: recipe.types,
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
  },
);

'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getRecipeBySlug = cache(async (slug: string) => {
  try {
    return await prisma.recipe.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true } },
        images: { orderBy: { order: 'asc' } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            ingredients: { orderBy: { order: 'asc' } },
          },
        },
        ingredients: {
          where: { sectionId: null },
          orderBy: { order: 'asc' },
        },
        utensils: {
          include: { utensil: true },
        },
        recipeTypes: {
          include: { recipeType: true },
        },
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'production')
      console.error('[getRecipeBySlug] fallback:', error);
    return null;
  }
});

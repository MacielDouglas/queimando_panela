'use server';

import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const getRecipeBySlug = cache(async (slug: string) => {
  return prisma.recipe.findUnique({
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
});

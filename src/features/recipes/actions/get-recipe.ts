import { prisma } from '@/lib/prisma';

export async function getRecipeBySlug(slug: string) {
  return prisma.recipe.findUnique({
    where: {
      slug,
    },
    include: {
      ingredients: {
        orderBy: { order: 'asc' },
      },
      utensils: {
        include: { utensil: true },
        orderBy: { createdAt: 'asc' },
      },
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export type RecipeDetail = NonNullable<Awaited<ReturnType<typeof getRecipeBySlug>>>;

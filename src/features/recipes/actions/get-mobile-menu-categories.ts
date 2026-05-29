'use server';

import { prisma } from '@/lib/prisma';

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export async function getMobileMenuCategories() {
  const types = await prisma.recipeType.findMany({
    where: {
      recipes: {
        some: {
          recipe: { isPublished: true },
        },
      },
    },
    select: {
      name: true,
    },
  });

  const unique = Array.from(
    new Set(types.map((t) => t.name.trim()).filter((name) => name.length > 0)),
  );

  if (unique.length <= 10) {
    return unique;
  }

  return shuffle(unique).slice(0, 10);
}

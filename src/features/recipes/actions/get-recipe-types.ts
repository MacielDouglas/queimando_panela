import { prisma } from '@/lib/prisma';

export async function getRecipeTypes(): Promise<string[]> {
  const results = await prisma.recipe.findMany({
    where: { isPublished: true, type: { not: '' } },
    select: { type: true },
    distinct: ['type'],
    orderBy: { type: 'asc' },
  });

  return results.map((r) => r.type).filter(Boolean);
}

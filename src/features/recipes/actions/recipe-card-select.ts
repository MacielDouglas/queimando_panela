import type { Prisma } from '@/generated/prisma/client';
import type { RecipeCardData } from './get-all-recipes';

/**
 * Select mínimo compartilhado dos cards (Home + listagem).
 * Traz só a capa (ordenada no banco: isCover primeiro) em vez de
 * 2 imagens + find em JS — menos bytes no Neon e no 4G.
 */
export const recipeCardSelect = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  difficulty: true,
  prepTimeMinutes: true,
  cookTimeMinutes: true,
  createdAt: true,
  images: {
    orderBy: [{ isCover: 'desc' }, { order: 'asc' }],
    take: 1,
    select: { url: true },
  },
  author: { select: { name: true } },
  recipeTypes: {
    select: { recipeType: { select: { name: true } } },
  },
} satisfies Prisma.RecipeSelect;

export type RecipeCardPrismaRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  difficulty: RecipeCardData['difficulty'];
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  createdAt: Date;
  images: { url: string }[];
  author?: { name: string | null } | null;
  recipeTypes: { recipeType: { name: string } }[];
};

export function mapToRecipeCardData(
  recipe: RecipeCardPrismaRow,
): RecipeCardData {
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
    coverUrl: recipe.images[0]?.url ?? null,
    authorName: recipe.author?.name ?? null,
  };
}

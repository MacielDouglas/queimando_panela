'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slugify';
import type {
  ParsedIngredient,
  ParsedUtensil,
  UpdateRecipeActionState,
} from '../types/recipe-form.types';
import { Prisma } from '../../../../generated/prisma/client';

const recipeSchema = z.object({
  title: z.string().trim().min(3, 'Título com pelo menos 3 caracteres.'),
  summary: z.string().trim().max(180).optional().or(z.literal('')),
  story: z.string().trim().optional().or(z.literal('')),
  modeOfPreparation: z.string().trim().min(20, 'Modo de preparo muito curto.'),
  suggestions: z.string().trim().optional().or(z.literal('')),
  notesAuthor: z.string().trim().optional().or(z.literal('')),
  notesPublic: z.string().trim().optional().or(z.literal('')),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  type: z.string().trim().min(1, 'Informe o tipo da receita.'),
  prepTimeMinutes: z.string().optional(),
  cookTimeMinutes: z.string().optional(),
  servings: z.string().optional(),
  aiIngredients: z.string().optional(),
  aiUtensils: z.string().optional(),
  recipeId: z.string().min(1),
  nutritionSummary: z.string().trim().max(300).optional().or(z.literal('')),
  nutritionTable: z.string().optional(),
});

function toNullableNumber(value?: string): number | null {
  if (!value?.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toNullable(value?: string): string | null {
  return value?.trim() ? value.trim() : null;
}

export async function updateRecipeAction(
  _prev: UpdateRecipeActionState,
  formData: FormData,
): Promise<UpdateRecipeActionState> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return { status: 'error', message: 'Sessão expirada. Entre novamente.' };
  }

  const raw = Object.fromEntries(formData);
  const parsed = recipeSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Dados inválidos.',
    };
  }

  const data = parsed.data;

  const existing = await prisma.recipe.findUnique({
    where: { id: data.recipeId },
    select: { authorId: true, slug: true, title: true },
  });

  if (!existing) {
    return { status: 'error', message: 'Receita não encontrada.' };
  }

  if (existing.authorId !== session.user.id) {
    return { status: 'error', message: 'Sem permissão para editar esta receita.' };
  }

  let ingredients: ParsedIngredient[] = [];
  let utensils: ParsedUtensil[] = [];
  try {
    ingredients = JSON.parse(data.aiIngredients ?? '[]') as ParsedIngredient[];
    utensils = JSON.parse(data.aiUtensils ?? '[]') as ParsedUtensil[];
  } catch {
    return {
      status: 'error',
      message: 'Dados gerados pela IA inválidos. Gere novamente.',
    };
  }

  let nutritionPer100g: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined;

  try {
    const parsedNutrition = JSON.parse(data.nutritionTable ?? '[]') as Prisma.InputJsonValue;

    if (Array.isArray(parsedNutrition) && parsedNutrition.length > 0) {
      nutritionPer100g = parsedNutrition;
    } else {
      nutritionPer100g = Prisma.JsonNull;
    }
  } catch {
    nutritionPer100g = Prisma.JsonNull;
  }

  let slug = existing.slug;
  if (slugify(data.title) !== slugify(existing.title)) {
    const baseSlug = slugify(data.title);
    const count = await prisma.recipe.count({
      where: { slug: { startsWith: baseSlug }, NOT: { id: data.recipeId } },
    });
    slug = count > 0 ? `${baseSlug}-${count + 1}` : baseSlug;
  }

  const validIngredients = ingredients
    .filter((i) => i?.name?.trim())
    .map((i, order) => ({
      amount: i.amount?.trim() || null,
      unit: i.unit?.trim() || null,
      name: i.name.trim(),
      originalText: i.originalText?.trim() || i.name.trim(),
      order,
    }));

  const uniqueUtensils = Array.from(
    new Map(
      utensils
        .filter((u) => u?.name?.trim())
        .map((u) => [u.name.trim().toLowerCase(), u.name.trim()]),
    ).values(),
  );

  await prisma.$transaction(async (tx) => {
    await tx.recipe.update({
      where: { id: data.recipeId },
      data: {
        title: data.title,
        slug,
        summary: toNullable(data.summary),
        story: toNullable(data.story),
        modeOfPreparation: data.modeOfPreparation,
        suggestions: toNullable(data.suggestions),
        notesAuthor: toNullable(data.notesAuthor),
        notesPublic: toNullable(data.notesPublic),
        difficulty: data.difficulty,
        type: data.type,
        prepTimeMinutes: toNullableNumber(data.prepTimeMinutes),
        cookTimeMinutes: toNullableNumber(data.cookTimeMinutes),
        servings: toNullableNumber(data.servings),
        nutritionSummary: toNullable(data.nutritionSummary),
        nutritionPer100g,
      },
    });

    await tx.ingredient.deleteMany({ where: { recipeId: data.recipeId } });

    if (validIngredients.length > 0) {
      await tx.ingredient.createMany({
        data: validIngredients.map((i) => ({ ...i, recipeId: data.recipeId })),
      });
    }

    await tx.utensilOnRecipe.deleteMany({ where: { recipeId: data.recipeId } });

    for (const name of uniqueUtensils) {
      const utensil = await tx.utensil.upsert({
        where: { name },
        update: {},
        create: { name },
      });

      await tx.utensilOnRecipe.create({
        data: { recipeId: data.recipeId, utensilId: utensil.id },
      });
    }
  });

  redirect(`/receitas/${slug}`);
}

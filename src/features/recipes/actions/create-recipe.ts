'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slugify';
import type {
  CreateRecipeActionState,
  ParsedIngredient,
  ParsedUtensil,
} from '../types/recipe-form.types';

// ─── Schema ────────────────────────────────────────────────────────────────────

const recipeSchema = z.object({
  title: z.string().trim().min(3, 'Título com pelo menos 3 caracteres.'),
  summary: z.string().trim().max(180).optional().or(z.literal('')),
  story: z.string().trim().optional().or(z.literal('')),
  modeOfPreparation: z.string().trim().min(20, 'Modo de preparo muito curto.'),
  suggestions: z.string().trim().optional().or(z.literal('')),
  notesAuthor: z.string().trim().optional().or(z.literal('')),
  notesPublic: z.string().trim().optional().or(z.literal('')),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  type: z.enum(['SWEET', 'SAVORY', 'DRINK', 'OTHER']),
  prepTimeMinutes: z.string().optional(),
  cookTimeMinutes: z.string().optional(),
  servings: z.string().optional(),
  aiIngredients: z.string().optional(),
  aiUtensils: z.string().optional(),
});

// ─── State ─────────────────────────────────────────────────────────────────────

// export type CreateRecipeActionState = {
//   status: "idle" | "error";
//   message: string;
// };

// export const initialCreateRecipeState: CreateRecipeActionState = {
//   status: "idle",
//   message: "",
// };

// ─── Helpers ───────────────────────────────────────────────────────────────────

function toNullableNumber(value?: string): number | null {
  if (!value?.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toNullable(value?: string): string | null {
  return value?.trim() ? value.trim() : null;
}

// ─── Action ────────────────────────────────────────────────────────────────────

export async function createRecipeAction(
  _prev: CreateRecipeActionState,
  formData: FormData,
): Promise<CreateRecipeActionState> {
  // 1. Valida sessão dentro da action (recomendado pelo Next.js)
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return { status: 'error', message: 'Sessão expirada. Entre novamente.' };
  }

  // 2. Valida schema
  const raw = Object.fromEntries(formData);
  const parsed = recipeSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Dados inválidos.',
    };
  }

  const data = parsed.data;

  // 3. Parse do JSON serializado dos campos IA
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

  // 4. Slug único
  const baseSlug = slugify(data.title);
  const count = await prisma.recipe.count({
    where: { slug: { startsWith: baseSlug } },
  });
  const slug = count > 0 ? `${baseSlug}-${count + 1}` : baseSlug;

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

  // 5. Transação Prisma
  const recipe = await prisma.$transaction(async (tx) => {
    const created = await tx.recipe.create({
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
        authorId: session.user.id,
        isPublished: false,
        publishedAt: null,
      },
    });

    if (validIngredients.length > 0) {
      await tx.ingredient.createMany({
        data: validIngredients.map((i) => ({ ...i, recipeId: created.id })),
      });
    }

    for (const name of uniqueUtensils) {
      const utensil = await tx.utensil.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      await tx.utensilOnRecipe.create({
        data: { recipeId: created.id, utensilId: utensil.id },
      });
    }

    return created;
  });

  redirect(`/receitas/${recipe.slug}`);
}

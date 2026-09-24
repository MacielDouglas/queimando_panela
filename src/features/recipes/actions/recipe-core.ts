import type { RecipeDifficulty } from '@/generated/prisma/client';
import type { AiRecipeAnalysis } from '../types/recipe-ai.types';

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function normalizeDifficulty(
  difficulty: AiRecipeAnalysis['difficulty'],
): RecipeDifficulty {
  if (
    difficulty === 'EASY' ||
    difficulty === 'EASY_MEDIUM' ||
    difficulty === 'MEDIUM' ||
    difficulty === 'MEDIUM_HARD' ||
    difficulty === 'HARD'
  ) {
    return difficulty;
  }

  return 'MEDIUM';
}

export function normalizeLower(value: string) {
  return value.trim().toLowerCase();
}

function randomSuffix(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (const b of bytes) out += chars[b % chars.length];
  return out;
}

/**
 * Slug único sem loop N+1 no banco: tenta o base uma vez, em colisão
 * anexa sufixo aleatório (máx. 3 tentativas).
 * Chamadores devem passar `exists: (slug) => Promise<boolean>`.
 */
export async function resolveUniqueSlug(
  baseTitle: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const fallback = 'receita';
  const base = slugify(baseTitle).slice(0, 60) || fallback;
  if (!(await exists(base))) return base;
  for (let i = 0; i < 3; i++) {
    const candidate = `${base}-${randomSuffix()}`;
    if (!(await exists(candidate))) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Parte comum de dados da receita usada em create/update:
 * campos básicos + sections + utensils + recipeTypes.
 */
export function buildRecipeCoreData(
  analysis: AiRecipeAnalysis,
  story?: string,
) {
  return {
    title: analysis.title,
    summary: analysis.summary,
    story: story ?? null,
    difficulty: normalizeDifficulty(analysis.difficulty),
    prepTimeMinutes: analysis.prepTimeMinutes,
    cookTimeMinutes: analysis.cookTimeMinutes,
    suggestions: analysis.suggestions,
    nutritionSummary: analysis.nutritionSummary,
    nutritionPer100g: analysis.nutritionPer100g,
    sections: {
      create: analysis.sections.map((section, index) => ({
        name: section.name,
        modeOfPreparation: section.modeOfPreparation,
        order: index,
      })),
    },
    utensils: {
      create: analysis.utensils
        .map((name) => normalizeLower(name))
        .filter(Boolean)
        .map((name) => ({
          utensil: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
    },
    recipeTypes: {
      create: Array.from(
        new Set(analysis.types.map(normalizeLower).filter(Boolean)),
      ).map((name) => ({
        recipeType: {
          connectOrCreate: {
            where: { name },
            create: { name },
          },
        },
      })),
    },
  };
}

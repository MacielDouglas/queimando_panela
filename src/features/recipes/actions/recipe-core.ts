import { Prisma, type RecipeDifficulty } from "@/generated/prisma/client";
import type { AiRecipeAnalysis } from "../types/recipe-ai.types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 150);
}

/** Garante mapeamento seguro para o enum RecipeDifficulty do Prisma */
export function toPrismaDifficulty(
  difficulty: AiRecipeAnalysis["difficulty"],
): RecipeDifficulty {
  const valid: RecipeDifficulty[] = [
    "EASY",
    "EASY_MEDIUM",
    "MEDIUM",
    "MEDIUM_HARD",
    "HARD",
  ];
  return valid.includes(difficulty as RecipeDifficulty)
    ? (difficulty as RecipeDifficulty)
    : "MEDIUM";
}

/** Normaliza para lowercase sem acentos — usado em GeneralIngredient.name / Utensil.name */
export function normalizeLower(value?: string | null): string {
  const trimmed = value?.trim() ?? "";
  return trimmed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Deduplica array de strings normalizadas, removendo vazias */
export function uniqueNormalized(
  values?: Array<string | null | undefined>,
): string[] {
  return Array.from(
    new Set((values ?? []).map((v) => normalizeLower(v)).filter(Boolean)),
  );
}

/**
 * Monta os campos escalares de Recipe a partir da análise da IA.
 *
 * NÃO inclui: slug, authorId, isPublished, classificationId, worldOriginId,
 * originSummary — todos passados diretamente no tx.recipe.create para evitar
 * colisão de tipos e duplicação de propriedades.
 *
 * nutritionPer100g usa Prisma.JsonNull quando não há dados, pois o campo é
 * Json? no schema e o Prisma rejeita `null` direto nesse tipo.
 */
export function buildRecipeCoreData(
  analysis: AiRecipeAnalysis,
  fallbackStory?: string,
) {
  return {
    title: analysis.title.trim(),
    summary: analysis.summary?.trim() || null,
    story: analysis.history?.trim() || fallbackStory?.trim() || null,
    difficulty: toPrismaDifficulty(analysis.difficulty),
    prepTimeMinutes: analysis.prepTimeMinutes ?? null,
    cookTimeMinutes: analysis.cookTimeMinutes ?? null,
    suggestions: analysis.suggestions?.trim() || null,
    nutritionSummary: analysis.nutritionSummary?.trim() || null,
    // Campo Json? — Prisma.JsonNull obrigatório quando nulo
    nutritionPer100g: analysis.nutritionPer100g?.length
      ? (analysis.nutritionPer100g as Prisma.InputJsonValue)
      : Prisma.JsonNull,
    // consumptionSummary vem da classification.brazilianState
    consumptionSummary: analysis.classification?.brazilianState?.trim() || null,
  } as const;
}

/** Extrai nomes de tipo de receita para upsert em RecipeType */
export function extractRecipeTypeNames(analysis: AiRecipeAnalysis): string[] {
  return uniqueNormalized(analysis.types);
}

/** Extrai nomes de utensílio para upsert em Utensil */
export function extractUtensilNames(analysis: AiRecipeAnalysis): string[] {
  return (analysis.utensils ?? [])
    .map((u) => normalizeLower(u.name))
    .filter(Boolean);
}

/** Extrai nome da classificação gastronômica para upsert em RecipeClassification */
export function extractClassificationName(
  analysis: AiRecipeAnalysis,
): string | null {
  return analysis.classification?.label?.trim() || null;
}

/** Extrai nome da origem mundial para upsert em WorldOrigin */
export function extractWorldOriginName(
  analysis: AiRecipeAnalysis,
): string | null {
  return analysis.classification?.worldOrigin?.trim() || null;
}

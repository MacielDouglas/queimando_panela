import type { RecipeDifficultyValue } from "../types/recipe.types";

type MaybeArray<T> = T | T[] | undefined;

export function firstValue<T>(value: MaybeArray<T>): T | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeString(value: MaybeArray<string>): string | undefined {
  const normalized = firstValue(value)?.trim();
  return normalized || undefined;
}

export function normalizeDifficulty(
  value: MaybeArray<RecipeDifficultyValue>,
): RecipeDifficultyValue | undefined {
  const v = firstValue(value);
  const valid: RecipeDifficultyValue[] = [
    "EASY",
    "EASY_MEDIUM",
    "MEDIUM",
    "MEDIUM_HARD",
    "HARD",
  ];
  return valid.includes(v as RecipeDifficultyValue)
    ? (v as RecipeDifficultyValue)
    : undefined;
}

/** Normaliza string para uso em GeneralIngredient.name e Utensil.name */
export function normalizeLower(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

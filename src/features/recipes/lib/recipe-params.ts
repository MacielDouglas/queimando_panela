type MaybeArray<T> = T | T[] | undefined;

export function firstValue<T>(value: MaybeArray<T>): T | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeString(value: MaybeArray<string>): string | undefined {
  const normalized = firstValue(value)?.trim();
  return normalized || undefined;
}

export function normalizeDifficulty(
  value: MaybeArray<'EASY' | 'MEDIUM' | 'HARD'>,
): 'EASY' | 'MEDIUM' | 'HARD' | undefined {
  const v = firstValue(value);
  if (v === 'EASY' || v === 'MEDIUM' || v === 'HARD') return v;
  return undefined;
}

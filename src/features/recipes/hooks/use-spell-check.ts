import { useState } from 'react';
import type { SpellCheckFields, SpellCheckResult } from '@/server/ai/groq/spell-checker';

export type DiffLine = {
  field: keyof SpellCheckFields;
  label: string;
  original: string;
  corrected: string;
  changed: boolean;
};

const FIELD_LABELS: Record<keyof SpellCheckFields, string> = {
  title: 'Título',
  summary: 'Resumo',
  story: 'História',
  modeOfPreparation: 'Modo de preparo',
  suggestions: 'Sugestões',
  notesAuthor: 'Notas do autor',
  notesPublic: 'Notas públicas',
};

export function useSpellCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diffs, setDiffs] = useState<DiffLine[] | null>(null);

  async function check(fields: SpellCheckFields): Promise<SpellCheckResult | null> {
    setError(null);
    setIsChecking(true);
    try {
      const response = await fetch('/api/recipes/spellcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!response.ok) throw new Error('Erro ao revisar texto.');
      const result = (await response.json()) as SpellCheckResult;

      const lines: DiffLine[] = (Object.keys(FIELD_LABELS) as (keyof SpellCheckFields)[])
        .filter((k) => fields[k]?.trim())
        .map((k) => ({
          field: k,
          label: FIELD_LABELS[k],
          original: fields[k] ?? '',
          corrected: result[k] ?? fields[k] ?? '',
          changed: (result[k] ?? '').trim() !== (fields[k] ?? '').trim(),
        }));

      setDiffs(lines);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao revisar.');
      return null;
    } finally {
      setIsChecking(false);
    }
  }

  function clear() {
    setDiffs(null);
    setError(null);
  }

  return { isChecking, error, diffs, check, clear };
}

'use client';

import { useState } from 'react';
import type {
  GeneratedRecipeData,
  GenerateRecipeRequest,
} from '@/server/ai/groq/recipe-generator.types';

export type RecipeGeneratorState = {
  isGenerating: boolean;
  error: string | null;
  data: GeneratedRecipeData | null;
};

export function useRecipeGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GeneratedRecipeData | null>(null);

  async function generate(fields: GenerateRecipeRequest): Promise<GeneratedRecipeData | null> {
    setError(null);
    setIsGenerating(true);
    try {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json?.error ?? 'Erro ao gerar receita com IA.');
      }

      const result = (await response.json()) as GeneratedRecipeData;
      setData(result);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }

  function clear() {
    setData(null);
    setError(null);
  }

  return { isGenerating, error, data, generate, clear };
}

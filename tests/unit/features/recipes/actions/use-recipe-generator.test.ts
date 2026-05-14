import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useRecipeGenerator } from '@/features/recipes/hooks/use-recipe-generator';

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal('fetch', mockFetch);
});

const mockData = {
  modeOfPreparation: '1. Misture tudo.',
  summary: 'Receita deliciosa.',
  ingredients: [{ name: 'banana', amount: '3', unit: 'unidades', originalText: '3 bananas', order: 0 }],
  utensils: [{ name: 'tigela' }],
  classification: {
    primaryGroup: 'CARBOIDRATOS' as const,
    mainCategories: ['bolo'],
    nutritionTags: [],
    courseTypes: ['sobremesa'],
    typeSuggestions: ['Bolo'],
  },
  suggestions: '',
  difficulty: 'EASY' as const,
  cookTimeMinutes: 30,
  nutritionTable: [],
  nutritionSummary: '',
};

describe('useRecipeGenerator', () => {
  it('estado inicial está correto', () => {
    const { result } = renderHook(() => useRecipeGenerator());
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });

  it('define isGenerating durante a geração e retorna para false após', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useRecipeGenerator());

    await act(async () => {
      await result.current.generate({ title: 'Bolo', modeOfPreparation: 'Misture tudo.' });
    });

    expect(result.current.isGenerating).toBe(false);
  });

  it('retorna e salva os dados gerados com sucesso', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useRecipeGenerator());

    await act(async () => {
      await result.current.generate({ title: 'Bolo', modeOfPreparation: 'Misture.' });
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('define error quando a API retorna status de erro', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Falha na IA' }),
    });

    const { result } = renderHook(() => useRecipeGenerator());

    await act(async () => {
      await result.current.generate({ title: 'Bolo', modeOfPreparation: 'Misture.' });
    });

    expect(result.current.error).toBe('Falha na IA');
    expect(result.current.data).toBeNull();
  });

  it('clear() limpa data e error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useRecipeGenerator());

    await act(async () => {
      await result.current.generate({ title: 'Bolo', modeOfPreparation: 'Misture.' });
    });

    act(() => result.current.clear());

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useSpellCheck } from '@/features/recipes/hooks/use-spell-check';

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal('fetch', mockFetch);
});

describe('useSpellCheck', () => {
  it('estado inicial está correto', () => {
    const { result } = renderHook(() => useSpellCheck());
    expect(result.current.isChecking).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.diffs).toBeNull();
  });

  it('retorna diffs com campos corrigidos', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: 'Bolo de Banana', summary: 'Receita gostosa' }),
    });

    const { result } = renderHook(() => useSpellCheck());

    await act(async () => {
      await result.current.check({ title: 'bolo de banana', summary: 'Receita gostosa' });
    });

    expect(result.current.diffs).not.toBeNull();
    const titleDiff = result.current.diffs?.find((d) => d.field === 'title');
    expect(titleDiff?.changed).toBe(true);
    expect(titleDiff?.original).toBe('bolo de banana');
    expect(titleDiff?.corrected).toBe('Bolo de Banana');
  });

  it('marca campo como não alterado quando texto é igual', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: 'Bolo de Banana' }),
    });

    const { result } = renderHook(() => useSpellCheck());

    await act(async () => {
      await result.current.check({ title: 'Bolo de Banana' });
    });

    expect(result.current.diffs).not.toBeNull();
    const titleDiff = result.current.diffs?.find((d) => d.field === 'title');
    expect(titleDiff?.changed).toBe(false);
  });

  it('define error quando a API retorna status de erro', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });

    const { result } = renderHook(() => useSpellCheck());

    await act(async () => {
      await result.current.check({ title: 'Teste' });
    });

    expect(result.current.error).toMatch(/revisar/i);
    expect(result.current.diffs).toBeNull();
  });

  it('ignora campos vazios ao gerar diffs', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: 'Bolo', summary: '' }),
    });

    const { result } = renderHook(() => useSpellCheck());

    await act(async () => {
      await result.current.check({ title: 'Bolo', summary: '' });
    });

    const summaryDiff = result.current.diffs?.find((d) => d.field === 'summary');
    expect(summaryDiff).toBeUndefined();
  });

  it('clear() limpa diffs e error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: 'Bolo' }),
    });

    const { result } = renderHook(() => useSpellCheck());

    await act(async () => {
      await result.current.check({ title: 'Bolo' });
    });

    act(() => result.current.clear());

    expect(result.current.diffs).toBeNull();
    expect(result.current.error).toBeNull();
  });
});